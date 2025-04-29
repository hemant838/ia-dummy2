import * as React from 'react';
import { type Metadata } from 'next';

// import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { APP_NAME } from '@workspace/common/app';

import PageRenderer from '~/components/admin/pageRenderer';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle(`Companies | ${APP_NAME}`)
};

export default async function CompaniesPage(): Promise<React.JSX.Element> {
  return (
    <PageRenderer
      pageTitle="Companies"
      pageName="companies"
      apiEndpoint="companies"
      showTabFilters={false}
      tableColumn={[
        {
          label: 'Name',
          accessorKey: 'program.name'
        },
        {
          label: 'Thesis',
          accessorKey: 'thesis.name'
        },
        {
          label: 'Evaluation stages',
          accessorKey: 'evaluationStage'
        },
        {
          label: 'Investment type',
          accessorKey: 'investmentType'
        },
        {
          label: 'Domain/Industry',
          accessorKey: 'startupIndustryDomain'
        },
        {
          label: 'Startup source',
          accessorKey: 'startupSource'
        },
        {
          label: 'Referred by',
          accessorKey: 'referredById'
        },
        {
          label: 'Startup stage',
          accessorKey: 'stage'
        },
        {
          label: 'Type',
          accessorKey: 'type'
        },
        {
          label: 'About company',
          accessorKey: 'description'
        },
        {
          label: 'Data room drive link',
          accessorKey: 'dataRoomGDriveLinkPrimary'
        },
        {
          label: 'L1 Due date',
          accessorKey: 'l1DueDate'
        },
        {
          label: 'L2 Due date',
          accessorKey: 'l2DueDate'
        },
        {
          label: 'L2.5 Due date',
          accessorKey: 'l2_5DueDate'
        },
        {
          label: 'L3 due date',
          accessorKey: 'l3DueDate'
        },
        {
          label: 'POC',
          accessorKey: 'poc'
        },
        {
          label: 'Follow on Funding Ready',
          accessorKey: 'followOnFundingReady'
        },
        {
          label: 'Vertical partner',
          accessorKey: 'verticalPartnerId'
        },
        {
          label: 'Creation date',
          accessorKey: 'createdAt'
        },
        {
          label: 'Created by',
          accessorKey: 'createdBy'
        },
        {
          label: 'Notes',
          accessorKey: 'notes'
        },
        {
          label: 'Campus Evaluation Score',
          accessorKey: 'campusEvaluationScore'
        },
        {
          label: 'Remarks',
          accessorKey: 'remarks'
        },
        {
          label: 'Address',
          accessorKey: 'location'
        },
        {
          label: 'Founders',
          accessorKey: 'founders'
        },
        {
          label: 'Legal Name',
          accessorKey: 'legalName'
        }
      ]}
    />
  );
}
