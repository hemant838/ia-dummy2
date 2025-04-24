import * as React from 'react';
import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { getAuthContext } from '@workspace/auth/context';
import { getRedirectToSignIn } from '@workspace/auth/redirect';
import { routes } from '@workspace/routes';

import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Organizations')
};

export default async function OrganizationsLayout(
  props: React.PropsWithChildren
): Promise<React.JSX.Element> {
  // const ctx: any = await getAuthContext();

  // if (ctx?.session && !ctx?.session?.user?.completedOnboarding) {
  //   return redirect(routes.dashboard.onboarding.Index);
  // }

  return <>{props.children}</>;
}
