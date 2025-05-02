import * as React from 'react';
import { type Metadata } from 'next';

import { APP_NAME } from '@workspace/common/app';

// import { getJWTToken } from '@workspace/auth/jwtAccessToken';

import PageRenderer from '~/components/admin/pageRenderer';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle(`Programs | ${APP_NAME}`)
};

export default async function ProgramsPage(): Promise<React.JSX.Element> {
  return (
    <div className="relative h-full w-full space-y-3">
      <PageRenderer
        pageTitle="Program Management"
        pageName="program"
        apiEndpoint="program"
        showTabFilters={true}
        tabFilters={[
          {
            label: 'All program',
            value: 'all_program'
          },
          {
            label: 'Active program',
            value: 'active_program'
          },
          {
            label: 'Upcoming program',
            value: 'upcoming_program'
          },
          {
            label: 'Archived',
            value: 'archived'
          },
          {
            label: 'Draft',
            value: 'draft'
          }
        ]}
        tableColumn={[
          {
            label: 'Program Title',
            accessorKey: 'name'
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
            accessorKey: 'totalApplication'
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
      />
    </div>
  );
}
