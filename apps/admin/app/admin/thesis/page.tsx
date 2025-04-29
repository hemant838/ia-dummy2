import * as React from 'react';
import { type Metadata } from 'next';

// import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { APP_NAME } from '@workspace/common/app';

import PageRenderer from '~/components/admin/pageRenderer';
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
      showTabFilters={false}
      tableColumn={[
        {
          label: 'Thesis',
          accessorKey: 'name'
        },
        {
          label: 'Application received',
          accessorKey: 'program.name'
        },
        {
          label: 'L1',
          accessorKey: 'l1'
        },
        {
          label: 'L2',
          accessorKey: 'evaluationStage'
        },
        {
          label: 'L2.5',
          accessorKey: 'startup.investmentType'
        },
        {
          label: 'L3',
          accessorKey: 'startup.startupIndustryDomain'
        },
        {
          label: 'L4',
          accessorKey: 'startup.startupSource'
        },
        {
          label: 'Investment completed',
          accessorKey: 'startup.referredById'
        },
        {
          label: 'On hold',
          accessorKey: 'startup.stage'
        },
        {
          label: 'Dropped',
          accessorKey: 'startup.type'
        },
        {
          label: 'Rejected',
          accessorKey: 'startup.description'
        },
        {
          label: 'No Value',
          accessorKey: 'startup.dataRoomGDriveLinkPrimary'
        }
      ]}
    />
  );
}
