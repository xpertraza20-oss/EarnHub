import { NextRequest, NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const rpName = 'EarnHub';
const rpID = process.env.NODE_ENV === 'development' ? 'localhost' : new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').hostname;
const origin = process.env.NEXT_PUBLIC_APP_URL || `http://${rpID}:3000`;

export async function GET(request: NextRequest) {
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

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: { passkeys: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new TextEncoder().encode(user.id),
      userName: user.email,
      attestationType: 'none',
      excludeCredentials: user.passkeys.map(passkey => ({
        id: Buffer.from(passkey.credentialID, 'base64url'),
        transports: passkey.transports ? (passkey.transports as any).split(',') : [],
      })),
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'preferred',
      },
    });

    cookies().set('webauthn_challenge', options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 300,
      path: '/'
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error('Generate Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
