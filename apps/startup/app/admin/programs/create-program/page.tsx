import * as React from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown, LogIn } from 'lucide-react';

import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { APP_NAME } from '@workspace/common/app';
import { InvitationStatus } from '@workspace/database';
import { routes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';

import TabList from '~/components/admin/tabs';
import { createTitle } from '~/lib/formatters';

const PageTitle = ({ title, pageName }: any): React.JSX.Element => {
  return (
    <div className="flex h-auto w-full items-center justify-between">
      <h2 className="text-2xl leading-[150%] font-semibold">{title}</h2>

      <div className="flex items-center gap-x-3">
        <Button
          variant="secondary"
          className="gap-x-4 font-medium text-secondary-foreground max-h-[40px]"
        >
          <span>
            <LogIn className="size-5" />
          </span>
          <span>Export</span>
        </Button>

        <Button className="max-h-[40px] font-medium">Create {pageName}</Button>
      </div>
    </div>
  );
};

export const metadata: Metadata = {
  title: createTitle('Create Program')
};

export default async function CreateProgramPage(): Promise<React.JSX.Element> {
  const token = await getJWTToken();

  return (
    <div className="relative h-full w-full space-y-3">
      <PageTitle
        title="Create Program"
        pageName="program"
      />

      <div className="flex flex-row w-full items-center justify-between">
        {/*  */}
      </div>
    </div>
  );
}
