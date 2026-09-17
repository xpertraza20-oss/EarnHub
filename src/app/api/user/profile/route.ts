import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Return profile data (excluding password)
    return NextResponse.json({
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: (user as any).avatar,
        balance: user.balance,
        pendingBalance: user.pendingBalance,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { name, password, oldPassword, avatar } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    
    // If password is provided, verify old password and hash new one
    if (password) {
      if (!oldPassword) {
        return NextResponse.json({ error: 'Old password is required to set a new password' }, { status: 400 });
      }

      // Re-fetch user to get the hashed password
      const dbUser = await db.user.findUnique({ where: { id: user.id } });
      if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      const isOldPasswordValid = await bcrypt.compare(oldPassword, dbUser.password);
      if (!isOldPasswordValid) {
        return NextResponse.json({ error: 'Incorrect old password' }, { status: 400 });
      }

      if (password.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No data provided to update' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      profile: {
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: (updatedUser as any).avatar
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}