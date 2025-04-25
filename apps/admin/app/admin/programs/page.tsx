import * as React from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

import { APP_NAME } from '@workspace/common/app';
import { InvitationStatus } from '@workspace/database';
import { routes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';

import { RootTable } from '~/components/admin/table';
import { getPrograms } from '~/data/programs/get-programs';
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
  title: createTitle('Programs')
};

export default async function ProgramsPage(): Promise<React.JSX.Element> {
  const programs: any = await getPrograms();

  // const [programs, setPrograms] = React.useState<any>([]);

  // React.useEffect(() => {
  //   const fetchPrograms = async () => {
  //     const data = await getPrograms();
  //     setPrograms(data);
  //   };
  //   fetchPrograms();
  // }, []);

  return (
    <div className="relative h-full w-full space-y-3">
      <PageTitle
        title="Program Management"
        pageName="program"
      />

      <RootTable
        column={[
          {
            label: 'Program Title',
            accessorKey: 'programTitle'
          },
          {
            label: 'Start Date',
            accessorKey: 'startDate'
          },
          {
            label: 'End Date',
            accessorKey: 'endDate'
          },
          {
            label: 'Application No.',
            accessorKey: 'applicationNo'
          },
          {
            label: 'Status',
            accessorKey: 'status'
          },
          {
            label: '',
            accessorKey: 'actions'
          }
        ]}
        lineItems={programs}
      />
    </div>
  );
}
