import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Timewall lets you define custom variables in the postback URL
    // Recommended URL on Timewall Dashboard:
    // https://mearnhub.tech/api/postback/timewall?user_id={user_id}&reward={reward}&tx_id={id}&secret={your_secret_key}&status={status}
    
    const userId = searchParams.get('user_id') || searchParams.get('uid');
    const rewardStr = searchParams.get('reward') || searchParams.get('currency');
    const txId = searchParams.get('tx_id') || searchParams.get('id');
    const secret = searchParams.get('secret');
    const status = searchParams.get('status') || '1'; // 1 = approved, 2 = reversed
    
    if (!userId || !rewardStr || !txId || !secret) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const reward = parseFloat(rewardStr);

    if (isNaN(reward)) {
      return NextResponse.json({ error: 'Invalid reward amount' }, { status: 400 });
    }

    // Security Check: Match the secret key passed in the URL with the one in our .env
    // This is a secure method as long as the connection is HTTPS.
    const expectedSecret = process.env.TIMEWALL_SECRET_KEY;
    if (!expectedSecret) {
      console.error('TIMEWALL_SECRET_KEY is not configured in .env');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (secret !== expectedSecret) {
      console.error(`Invalid secret key. Received: ${secret}`);
      return NextResponse.json({ error: 'Invalid signature/secret' }, { status: 401 });
    }

    // Database Logic
    const existingTransaction = await db.completedTask.findUnique({
      where: { tx_id: txId }
    });

    if (existingTransaction) {
      // Transaction already processed. Return 200 to acknowledge.
      return NextResponse.json({ message: 'Transaction already processed' }, { status: 200 });
    }

    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Timewall Status 2 usually means chargeback/reversal
    const isReversal = status === '2' || status === 'reversed';

    if (isReversal) {
      await db.user.update({
        where: { id: userId },
        data: { balance: { decrement: reward } }
      });

      await db.completedTask.create({
        data: {
          userId: userId,
          status: 'reversed',
          rewardAmount: -reward,
          tx_id: txId,
          provider: 'TimeWall'
        }
      });
      return NextResponse.json({ message: 'Reversal processed' }, { status: 200 });
    } else {
      await db.user.update({
        where: { id: userId },
        data: { balance: { increment: reward } }
      });

      await db.completedTask.create({
        data: {
          userId: userId,
          status: 'completed',
          rewardAmount: reward,
          tx_id: txId,
          provider: 'TimeWall'
        }
      });
      return NextResponse.json({ message: 'User credited successfully' }, { status: 200 });
    }

  } catch (error) {
    console.error('TimeWall Postback Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
