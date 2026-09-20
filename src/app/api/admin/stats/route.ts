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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const [
      totalUsers,
      totalTasks,
      pendingWithdrawals,
      totalEarnings,
      recentCompletedTasks,
      totalVisitsResult,
      activeUsersOnlineList,
      visitorLogs
    ] = await Promise.all([
      db.user.count(),
      db.completedTask.count(),
      db.withdrawal.count({ where: { status: 'pending' } }),
      db.completedTask.aggregate({ _sum: { rewardAmount: true } }),
      db.completedTask.findMany({
        where: { completedAt: { gte: sevenDaysAgo } },
        select: { completedAt: true, rewardAmount: true }
      }),
      db.siteAnalytics.aggregate({ _sum: { visits: true } }),
      db.user.findMany({ 
        where: { lastActiveAt: { gte: fifteenMinutesAgo } },
        select: { id: true, name: true, email: true, lastActiveAt: true }
      }),
      db.visitorLog.findMany({
        orderBy: { visitedAt: 'desc' },
        take: 50
      })
    ]);

    const totalSiteVisits = totalVisitsResult._sum.visits || 0;
    const activeUsersOnline = activeUsersOnlineList.length;

    // Aggregate chart data by day
    const chartDataMap: Record<string, number> = {};
    // Initialize last 7 days with 0
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      chartDataMap[dateStr] = 0;
    }
    
    recentCompletedTasks.forEach(t => {
      const dateStr = t.completedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (chartDataMap[dateStr] !== undefined) {
        chartDataMap[dateStr] += t.rewardAmount;
      }
    });

    const chartData = Object.keys(chartDataMap).map(date => ({
      date,
      revenue: chartDataMap[date]
    }));

    const stats = {
      totalUsers,
      totalTasks,
      pendingWithdrawals,
      totalEarnings: totalEarnings._sum.rewardAmount || 0,
      totalSiteVisits,
      activeUsersOnline,
      activeUsersList: activeUsersOnlineList,
      visitorLogs,
      chartData: chartData
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}