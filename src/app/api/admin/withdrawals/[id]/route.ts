import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import { processEasypaisaTransfer } from '@/lib/payments/easypaisa';
import { processJazzcashTransfer } from '@/lib/payments/jazzcash';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json(); // 'approve' or 'reject'

    // Fetch the withdrawal
    const withdrawal = await db.withdrawal.findUnique({
      where: { id: params.id },
      include: { user: true }
    });

    if (!withdrawal || withdrawal.status !== 'pending') {
      return NextResponse.json({ error: 'Invalid withdrawal or not pending' }, { status: 400 });
    }

    if (action === 'approve') {
      let paymentSuccess = true;
      let transactionId = undefined;
      let errorMessage = 'Automated transfer failed';

      // 1. Process automated payment based on method
      if (withdrawal.method === 'easypaisa') {
        const result = await processEasypaisaTransfer(withdrawal.accountDetails, withdrawal.amount, withdrawal.id);
        paymentSuccess = result.success;
        transactionId = result.transactionId;
        if (!result.success && result.error) errorMessage = result.error;
      } else if (withdrawal.method === 'jazzcash') {
        const result = await processJazzcashTransfer(withdrawal.accountDetails, withdrawal.amount, withdrawal.id);
        paymentSuccess = result.success;
        transactionId = result.transactionId;
        if (!result.success && result.error) errorMessage = result.error;
      }

      // 2. Handle Payment Failure
      if (!paymentSuccess) {
        // Automatically reject if the API transfer fails so user gets money back
        await db.$transaction([
          db.withdrawal.update({
            where: { id: params.id },
            data: { status: 'rejected' }
          }),
          db.user.update({
            where: { id: withdrawal.userId },
            data: { 
              pendingBalance: { decrement: withdrawal.amount },
              balance: { increment: withdrawal.amount }
            }
          })
        ]);

        return NextResponse.json({ 
          error: `Payment failed: ${errorMessage}. Withdrawal automatically rejected and refunded.` 
        }, { status: 400 });
      }

      // 3. Payment Successful -> Update DB
      await db.$transaction([
        db.withdrawal.update({
          where: { id: params.id },
          data: { 
            status: 'completed'
            // We could store the transactionId here if we add it to the schema in the future
          }
        }),
        db.user.update({
          where: { id: withdrawal.userId },
          data: { pendingBalance: { decrement: withdrawal.amount } }
        })
      ]);

      return NextResponse.json({ 
        success: true, 
        message: 'Payment sent successfully and withdrawal approved.',
        transactionId 
      });

    } else if (action === 'reject') {
      // Reject: mark as rejected, and restore balance from pendingBalance back to balance
      await db.$transaction([
        db.withdrawal.update({
          where: { id: params.id },
          data: { status: 'rejected' }
        }),
        db.user.update({
          where: { id: withdrawal.userId },
          data: { 
            pendingBalance: { decrement: withdrawal.amount },
            balance: { increment: withdrawal.amount }
          }
        })
      ]);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Withdrawal action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
