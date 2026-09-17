import { NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db'; // Make sure this points to your instantiated Prisma client

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. Extract Query Parameters
    const userIdStr = searchParams.get('user_id');
    const rewardStr = searchParams.get('reward');
    const txId = searchParams.get('tx_id');
    const incomingHash = searchParams.get('hash');
    const isReversal = searchParams.get('reversal') === '1' || searchParams.get('reversal') === 'true';

    // 2. Initial Validation
    if (!userIdStr || !rewardStr || !txId || !incomingHash) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const userId = userIdStr;
    const reward = parseFloat(rewardStr);

    if (isNaN(reward)) {
      return NextResponse.json({ error: 'Invalid reward amount' }, { status: 400 });
    }

    // 3. Security Check: HMAC SHA-1 Hash Validation
    const secretKey = process.env.THEOREMREACH_SECRET_KEY;
    if (!secretKey) {
      console.error('THEOREMREACH_SECRET_KEY is not configured in .env.local');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // The string to hash according to TheoremReach docs: user_id + reward + tx_id
    // Example: "123450.55a1b2c3d4"
    const stringToHash = `${userIdStr}${rewardStr}${txId}`;
    
    // Generate HMAC SHA-1 hash using the secret key
    const hmac = crypto.createHmac('sha1', secretKey);
    hmac.update(stringToHash);
    let generatedHash = hmac.digest('base64');

    // Make base64 hash URL-safe as required by TheoremReach
    generatedHash = generatedHash
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); // Remove trailing padding '='

    // Compare generated hash with the incoming hash
    if (generatedHash !== incomingHash) {
      console.error(`Hash mismatch. Expected: ${generatedHash}, Received: ${incomingHash}`);
      // Security standard: Always return 401 for bad signatures to prevent tampering
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 4. Database Logic (Prisma)
    
    // Step A: Duplicate Transaction Check
    // We use the `tx_id` field in CompletedTask to store the tx_id for uniqueness.
    const existingTransaction = await db.completedTask.findUnique({
      where: {
        tx_id: txId // txId represents the unique transaction identifier from TheoremReach
      }
    });

    if (existingTransaction) {
      // Return 200 OK so TheoremReach stops retrying this webhook, 
      // but do NOT credit the user again.
      return NextResponse.json({ message: 'Transaction already processed (duplicate ignored).' }, { status: 200 });
    }

    // Step B: Ensure the user exists before updating
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Step C: Handle Reversal or Credit
    if (isReversal) {
      // Reversal: Deduct the reward from the user's balance
      await db.user.update({
        where: { id: userId },
        data: {
          balance: { decrement: reward }
        }
      });

      // Log the reversal transaction
      await db.completedTask.create({
        data: {
          userId: userId,
          status: 'reversed',
          rewardAmount: -reward,
          tx_id: txId, // Using the new tx_id field
          provider: 'TheoremReach' // Using the new provider field
        }
      });

      return NextResponse.json({ message: 'Chargeback/Reversal processed successfully' }, { status: 200 });

    } else {
      // Credit: Add the reward to the user's balance
      await db.user.update({
        where: { id: userId },
        data: {
          balance: { increment: reward }
        }
      });

      // Log the successful transaction
      await db.completedTask.create({
        data: {
          userId: userId,
          status: 'completed', // Using completed as requested
          rewardAmount: reward,
          tx_id: txId,
          provider: 'TheoremReach'
        }
      });

      return NextResponse.json({ message: 'Postback processed and user credited successfully' }, { status: 200 });
    }

  } catch (error) {
    console.error('TheoremReach Postback Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
