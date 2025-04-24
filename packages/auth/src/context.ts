// import { log } from 'console';
import { cache } from 'react';
// import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { getRedirectToSignIn } from '@workspace/auth/redirect';
import { checkSession } from '@workspace/auth/session';
// import { prisma } from '@workspace/database/client';
import { routes } from '@workspace/routes';

import { dedupedAuth } from '.';

const dedupedGetActiveOrganization = cache(async function () {
  const tokenUser = await getJWTToken();
  const { jwtToken } = tokenUser;

  const userInfo = await dedupedGetUserInfo(tokenUser.id);

  const organizationId = userInfo?.data?.organizationId;

  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/v1/api/organization/${organizationId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    }
  );

  const organizationData: any = await response.json();
  const organization = organizationData?.data;

  if (!organization || !organizationData.status) {
    // Instead of not-found we can just redirect.
    return redirect(routes.dashboard.organizations.Index);
  }

  return {
    ...organization,
    logo: organization.logo ? organization.logo : undefined
  };
});

const dedupedGetUserInfo = cache(async function (userId?: string) {
  const tokenUser = await getJWTToken();
  const { jwtToken } = tokenUser;

  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/v1/api/user`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    }
  );

  const userInfo: any = await response.json();

  if (!userInfo || !userInfo.status || !userInfo.data) {
    // Should not happen, but if it does let's sign out the user.
    // One possible scenario is if someone is fiddling with the database while a user is still logged in.
    const logoutResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/api/auth/signout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const logoutInfo: any = await logoutResponse.json();

    if (logoutInfo.status !== 200) {
      console.error('Error signing out user', logoutInfo);
      return;
    }

    return {
      error: 'Session expired. Please sign in again.',
      status: false,
      code: 401,
      logout: true,
      session: null
    };
  }

  return userInfo;
});

export async function getAuthContext() {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getRedirectToSignIn());
  }

  const userInfo = await dedupedGetUserInfo(session.user.id);

  if (userInfo.error || !userInfo.status) {
    return {
      ...userInfo,
      session: null
    };
  }

  const enrichedSession = {
    ...session,
    user: {
      ...session.user,
      ...userInfo.data,
      completedOnboarding: true
    }
  };

  return { session: enrichedSession };
}

export async function getAuthOrganizationContext() {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getRedirectToSignIn());
  }

  const activeOrganization = await dedupedGetActiveOrganization();
  const userInfo = await dedupedGetUserInfo(session.user.id);
  // if (
  //   !userInfo?.memberships?.some(
  //     (m: any) => m.organizationId == activeOrganization.id
  //   )
  // ) {
  //   // Instead of forbidden we can just redirect.
  //   return redirect(routes.dashboard.organizations.Index);
  // }

  const enrichedSession = {
    ...session,
    user: {
      ...session.user,
      ...userInfo
    }
  };

  return { session: enrichedSession, organization: activeOrganization };
}
