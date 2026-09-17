import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, generateToken, generateReferralCode } from '@/lib/auth';
import { checkDuplicateAccount, validateEmail, validatePhone } from '@/lib/antiFraud';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, referralCode } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    if (!await validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (phone && !await validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Anti-fraud check
    const isDuplicate = await checkDuplicateAccount(email, phone);
    if (isDuplicate) {
      return NextResponse.json(
        { error: 'Account already exists' },
        { status: 400 }
      );
    }

    // Check referral
    let referredBy = null;
    if (referralCode) {
      const referrer = await db.user.findFirst({
        where: { referralCode }
      });
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const userReferralCode = generateReferralCode();

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        referralCode: userReferralCode,
        referredBy
      }
    });

    // Create referral record if referred
    if (referredBy) {
      await db.referral.create({
        data: {
          referrerId: referredBy,
          referredId: user.id,
          rewardEarned: 10
        }
      });

      // Add bonus to referrer
      await db.user.update({
        where: { id: referredBy },
        data: {
          pendingBalance: { increment: 10 }
        }
      });
    }

    // Generate token
    const token = generateToken(user.id);

    return NextResponse.json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}