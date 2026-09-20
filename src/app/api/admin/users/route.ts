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

    // Fetch all regular users with their completed tasks to calculate earnings
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        balance: true,
        pendingBalance: true,
        status: true,
        createdAt: true,
        referralCode: true,
        completedTasks: {
          select: {
            rewardAmount: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const enrichedUsers = users.map(user => {
      const netEarnings = user.completedTasks.reduce((acc, t) => acc + t.rewardAmount, 0);
      // Assuming a standard 20% platform commission, the user's 80% represents the netEarnings.
      const grossEarnings = netEarnings / 0.8;

      // Extract completedTasks to keep payload small
      const { completedTasks, ...userData } = user;
      
      return {
        ...userData,
        totalNetEarnings: netEarnings,
        totalGrossEarnings: grossEarnings,
      };
    });

    return NextResponse.json({ users: enrichedUsers });

  } catch (error) {
    console.error('Users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}