import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(request: NextRequest) {
  try {
    // 1. Increment site visits (upsert for today)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    await db.siteAnalytics.upsert({
      where: { date: today },
      update: { visits: { increment: 1 } },
      create: { date: today, visits: 1 }
    });

    // 2. If user is logged in, update their lastActiveAt
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id?: string };
        if (decoded && decoded.id) {
          await db.user.update({
            where: { id: decoded.id },
            data: { lastActiveAt: new Date() }
          });
        }
      } catch (err) {
        // Ignore token errors for analytics tracking
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Return 200 anyway so we don't block the frontend
    return NextResponse.json({ success: false });
  }
}
