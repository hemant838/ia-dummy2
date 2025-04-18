import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';

import { keys } from '../keys';

export async function getRawJwtTokenFromCookie(): Promise<string | null> {
  const cookieStore = cookies();

  const jwt =
    (await cookieStore).get('next-auth.session-token')?.value || // default cookie name for production
    (await cookieStore).get('__Secure-next-auth.session-token')?.value || // default for secure environments
    (await cookieStore).get('authjs.session-token')?.value ||
    null;

  return jwt;
}

export async function getJWTToken() {
  const decoded: any = await getToken({
    req: {
      headers: await headers()
    },
    secret: keys().AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production'
  });

  const rawToken: any = await getRawJwtTokenFromCookie();

  if (!rawToken) {
    console.log('No session token found in cookies');
    return null;
  }

  // Create a JWS token with the session data
  const jwsToken = jwt.sign(
    {
      ...decoded
    },
    keys().AUTH_SECRET, // Shared secret for JWS
    { algorithm: 'HS256' } // Use HS256 for simplicity
  );

  return {
    jwtToken: jwsToken,
    ...decoded
  };
}
