import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { generateToken } from '@/lib/auth';

const rpID = process.env.NODE_ENV === 'development' ? 'localhost' : new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').hostname;
const origin = process.env.NEXT_PUBLIC_APP_URL || `http://${rpID}:3000`;

export async function POST(request: NextRequest) {
  try {
    const { email, response } = await request.json();
    
    if (!email || !response) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
      include: { passkeys: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passkey = user.passkeys.find(pk => pk.credentialID === response.id);
    if (!passkey) {
      return NextResponse.json({ error: 'Passkey not found for this user' }, { status: 400 });
    }

    const expectedChallenge = cookies().get('webauthn_auth_challenge')?.value;
    if (!expectedChallenge) {
      return NextResponse.json({ error: 'Challenge expired' }, { status: 400 });
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator: {
          credentialID: Buffer.from(passkey.credentialID, 'base64url'),
          credentialPublicKey: passkey.credentialPublicKey,
          counter: Number(passkey.counter),
        },
      });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { verified, authenticationInfo } = verification;

    if (verified) {
      // Update the counter
      await db.passkey.update({
        where: { credentialID: passkey.credentialID },
        data: { counter: BigInt(authenticationInfo.newCounter) }
      });

      const token = generateToken(user.id);

      return NextResponse.json({
        verified: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          theme: user.theme
        }
      });
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error) {
    console.error('Verify Authentication error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
