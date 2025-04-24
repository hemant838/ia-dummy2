import * as React from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';

import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { APP_NAME } from '@workspace/common/app';
import { routes } from '@workspace/routes';
import { Logo } from '@workspace/ui/components/logo';

import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Dashboard')
};

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const token = await getJWTToken();

  return (
    <div className="relative w-full min-h-screen">
      <h1>Dashboard</h1>
    </div>
  );
}
