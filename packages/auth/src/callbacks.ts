import { cookies, headers } from 'next/headers';
// import { NextRequest } from 'next/server';
// import { isAfter } from 'date-fns';
import type { NextAuthConfig } from 'next-auth';

// import { getToken } from 'next-auth/jwt';

import { prisma } from '@workspace/database/client';
import { routes } from '@workspace/routes';

import { adapter } from './adapter';
import { AuthCookies } from './cookies';
import { AuthErrorCode } from './errors';
import { getRawJwtTokenFromCookie } from './jwtAccessToken';
import { OAuthProvider, Provider } from './providers.types';
import { getRedirectToTotp } from './redirect';

// import { generateSessionToken, getSessionExpiryFromNow } from './session';

// async function isSignedIn(): Promise<boolean> {
//   const cookieStore = await cookies();
//   const currentSessionToken = cookieStore.get(AuthCookies.SessionToken)?.value;

//   if (currentSessionToken) {
//     const sessionFromDb = await prisma.session.findFirst({
//       where: { sessionToken: currentSessionToken },
//       select: { expires: true }
//     });

//     if (sessionFromDb) {
//       return isAfter(sessionFromDb.expires, new Date());
//     }
//   }

//   return false;
// }

async function isSignedIn(): Promise<boolean> {
  const token = await getRawJwtTokenFromCookie();

  if (token) return true;

  return false;
}

async function isAuthenticatorAppEnabled(userId: string): Promise<boolean> {
  const count = await prisma.authenticatorApp.count({
    where: { userId }
  });
  return count > 0;
}

export const callbacks = {
  async signIn({ user, account, profile }): Promise<string | boolean> {
    if (!account) return false;

    // For credentials provider
    if (account.type === 'credentials') {
      if (!user?.id) return false;

      // Check if MFA is enabled
      if (account.provider === Provider.Credentials) {
        const mfaEnabled = await isAuthenticatorAppEnabled(user.id);
        if (mfaEnabled) {
          return getRedirectToTotp(user.id);
        }
      }

      return true;
    }

    // For OAuth providers
    if (!account.provider || !profile) return false;

    const isValidOAuthProvider = Object.values(OAuthProvider).includes(
      account.provider.toLowerCase() as OAuthProvider
    );
    if (!isValidOAuthProvider) {
      return `${routes.dashboard.auth.Error}?error=${AuthErrorCode.IllegalOAuthProvider}`;
    }

    if (account.provider === OAuthProvider.Google) {
      if (!profile.email_verified) {
        return `${routes.dashboard.auth.Error}?error=${AuthErrorCode.UnverifiedEmail}`;
      }
    }

    // Check existing OAuth account
    const existingOAuthAccount = await prisma.account.findFirst({
      where: {
        provider: account.provider,
        providerAccountId: account.providerAccountId
      },
      select: { userId: true }
    });

    const signedIn = await isSignedIn();

    if (signedIn) {
      // Explicit linking from settings
      if (existingOAuthAccount) {
        return `${routes.dashboard.organizations.Index}?error=${AuthErrorCode.AlreadyLinked}`;
      }
    } else {
      if (existingOAuthAccount) {
        if (
          existingOAuthAccount.userId &&
          (await isAuthenticatorAppEnabled(existingOAuthAccount.userId))
        ) {
          return getRedirectToTotp(existingOAuthAccount.userId);
        }
      } else {
        if (!profile.email) {
          return `${routes.dashboard.auth.Error}?error=${AuthErrorCode.MissingOAuthEmail}`;
        }

        const existingUserByEmail = await prisma.user.findFirst({
          where: { email: profile.email.toLowerCase() },
          select: { id: true }
        });

        if (
          existingUserByEmail &&
          (await isAuthenticatorAppEnabled(existingUserByEmail.id))
        ) {
          return `${routes.dashboard.auth.Error}?error=${AuthErrorCode.RequiresExplicitLinking}`;
        }
      }
    }

    // Trim names if needed
    if (user?.name) user.name = user.name.substring(0, 64);
    if (profile.name) profile.name = profile.name.substring(0, 64);

    return true;
  },
  async jwt({ token, user, account, trigger }) {
    if ((trigger === 'signIn' || trigger === 'signUp') && user) {
      token.id = user.id;
      token.name = user.name;
      token.email = user.email;

      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
    }

    // Let's not allow the client to indirectly update the token using useSession().update()
    if (trigger === 'update') {
      return token;
    }

    return token;
  },
  session({ session, token }) {
    const customSession: any = { ...session };

    if (token?.sub) {
      customSession.user.id = token.sub;
    }

    if (token?.accessToken) {
      customSession.token = token.accessToken;
    }

    if (token?.jwtToken) {
      customSession.jwtToken = token.jwtToken;
    }

    return customSession;
  }
} satisfies NextAuthConfig['callbacks'];
