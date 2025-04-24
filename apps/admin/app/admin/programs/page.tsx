import * as React from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';

import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { APP_NAME } from '@workspace/common/app';
import { routes } from '@workspace/routes';
import { Logo } from '@workspace/ui/components/logo';

import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Programs')
};

export default async function ProgramsPage(): Promise<React.JSX.Element> {
  const token = await getJWTToken();

  return <div className="relative min-h-screen bg-background">{/*  */}</div>;
}
