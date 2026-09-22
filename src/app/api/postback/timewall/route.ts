import { NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Timewall standard macros
    const userId = searchParams.get('userid');
    const rewardStr = searchParams.get('currency'); // We use currencyAmount for points
    const revenueStr = searchParams.get('revenue'); // USD revenue for hash validation
    const txId = searchParams.get('txid');
    const hash = searchParams.get('hash');
    const status = searchParams.get('status') || '1';
    const type = searchParams.get('type') || '0';
    
    // Status 2 usually means reversed in some offerwalls, but Timewall uses positive/negative values or specific types. 
    // We will assume negative currency = reversal or type = 2 = reversal depending on their docs, 
    // but the simplest check is if reward < 0.
    
    if (!userId || !rewardStr || !txId || !hash || !revenueStr) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const reward = parseFloat(rewardStr);
    const revenue = revenueStr; // Keep as string for exact hash matching

    if (isNaN(reward)) {
      return NextResponse.json({ error: 'Invalid reward amount' }, { status: 400 });
    }

    // Security Check 1: IP Whitelisting (Optional but recommended)
    // Timewall IPs: 18.156.132.55, 51.81.120.73, 142.111.248.18
    // Note: Vercel/Netlify proxies might obscure the real IP unless using req.headers.get('x-forwarded-for')
    
    // Security Check 2: Hash Validation
    // Timewall Hash = hash("sha256", userID . revenue . SecretKey)
    const secretKey = process.env.TIMEWALL_SECRET_KEY;
    if (!secretKey) {
      console.error('TIMEWALL_SECRET_KEY is not configured in .env');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const stringToHash = `${userId}${revenue}${secretKey}`;
    const generatedHash = crypto.createHash('sha256').update(stringToHash).digest('hex');

    if (generatedHash !== hash) {
      console.error(`Invalid hash. Expected: ${generatedHash}, Received: ${hash}`);
      return NextResponse.json({ error: 'Invalid signature/hash' }, { status: 401 });
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

    // If reward is negative, it's a chargeback
    const isReversal = reward < 0 || status === '2';

    if (isReversal) {
      await db.user.update({
        where: { id: userId },
        data: { balance: { decrement: Math.abs(reward) } }
      });

      await db.completedTask.create({
        data: {
          userId: userId,
          status: 'reversed',
          rewardAmount: reward, // Store the negative amount
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
