import * as React from 'react';
import { type Metadata } from 'next';

// import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { APP_NAME } from '@workspace/common/app';

import PageRenderer from '~/components/main/pageRenderer';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle(`Thesis | ${APP_NAME}`)
};

export default async function ThesisPage(): Promise<React.JSX.Element> {
  return (
    <PageRenderer
      pageTitle="Thesis"
      pageName="thesis"
      apiEndpoint="thesis"
      showTabFilters={true}
      readOnly={true}
      tabFilterByKey="id"
      // tabFilters={} // this is managed inside PageRenderer
      tableColumn={[
        {
          label: 'Application received',
          accessorKey: 'APPLICATION_RECEIVED.name',
          type: 'avatar'
        },
        {
          label: 'L1',
          accessorKey: 'L1.name',
          type: 'avatar'
        },
        {
          label: 'L2',
          accessorKey: 'L2.name',
          type: 'avatar'
        },
        {
          label: 'L2.5',
          accessorKey: 'L2_5.name',
          type: 'avatar'
        },
        {
          label: 'L3',
          accessorKey: 'L3.name',
          type: 'avatar'
        },
        {
          label: 'L4',
          accessorKey: 'L4.name',
          type: 'avatar'
        },
        {
          label: 'Investment completed',
          accessorKey: 'INVESTMENT_COMPLETED.name',
          type: 'avatar'
        },
        {
          label: 'On hold',
          accessorKey: 'OH_HOLD.name',
          type: 'avatar'
        },
        {
          label: 'Dropped',
          accessorKey: 'DROPPED.name',
          type: 'avatar'
        },
        {
          label: 'Rejected',
          accessorKey: 'REJECTED.name',
          type: 'avatar'
        },
        {
          label: 'No Value',
          accessorKey: 'NO_VALUE.name',
          type: 'avatar'
        }
      ]}
    />
  );
}
