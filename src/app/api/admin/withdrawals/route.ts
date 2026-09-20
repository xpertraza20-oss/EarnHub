import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded.admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all withdrawals
    const withdrawals = await db.withdrawal.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ withdrawals });

  } catch (error) {
    console.error('Withdrawals error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded.admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { withdrawalId, status } = body;

    // Validation
    if (!withdrawalId || !status) {
      return NextResponse.json(
        { error: 'Withdrawal ID and status are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected', 'processing', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update withdrawal
    const withdrawal = await db.withdrawal.update({
      where: { id: withdrawalId },
      data: { status }
    });

    // If rejected, refund balance
    if (status === 'rejected') {
      await db.user.update({
        where: { id: withdrawal.userId },
        data: {
          balance: { increment: withdrawal.amount }
        }
      });
    }

    return NextResponse.json({
      message: `Withdrawal ${status}`,
      withdrawal
    });

  } catch (error) {
    console.error('Update withdrawal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}