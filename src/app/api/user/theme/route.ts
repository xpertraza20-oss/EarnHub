import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { theme } = await request.json();
    
    if (!theme || typeof theme !== 'string' || theme.length > 30) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }

    await db.user.update({
      where: { id: decoded.userId },
      data: { theme }
    });

    return NextResponse.json({ message: 'Theme updated successfully' });
  } catch (error) {
    console.error('Theme update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
