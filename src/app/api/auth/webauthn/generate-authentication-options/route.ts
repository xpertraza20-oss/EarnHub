import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import type { AuthenticatorTransport } from '@simplewebauthn/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const host = request.headers.get('host') || 'localhost:3000';
    const rpID = host.split(':')[0];
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
      include: { passkeys: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.passkeys || user.passkeys.length === 0) {
      return NextResponse.json({ error: 'No passkeys registered for this user' }, { status: 400 });
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: user.passkeys.map(passkey => ({
        id: passkey.credentialID,
        transports: passkey.transports ? (passkey.transports as any).split(',') as AuthenticatorTransport[] : undefined,
      })),
      userVerification: 'preferred',
    });

    cookies().set('webauthn_auth_challenge', options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 300,
      path: '/'
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error('Generate Authentication error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
