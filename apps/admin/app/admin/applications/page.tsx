import * as React from 'react';
import { type Metadata } from 'next';

// import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { APP_NAME } from '@workspace/common/app';

import PageRenderer from '~/components/admin/pageRenderer';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle(`Applications | ${APP_NAME}`)
};

export default async function ApplicationsPage(): Promise<React.JSX.Element> {
  return (
    <PageRenderer
      pageTitle="Applications"
      pageName="applications"
      apiEndpoint="application"
      tableColumn={[
        {
          label: 'Name',
          accessorKey: 'program.name'
        },
        {
          label: 'Thesis',
          accessorKey: 'startup.thesis.name'
        },
        {
          label: 'Evaluation stages',
          accessorKey: 'evaluationStage'
        },
        {
          label: 'Investment type',
          accessorKey: 'startup.investmentType'
        },
        {
          label: 'Domain/Industry',
          accessorKey: 'startup.startupIndustryDomain'
        },
        {
          label: 'Startup source',
          accessorKey: 'startup.startupSource'
        },
        {
          label: 'Referred by',
          accessorKey: 'startup.referredById'
        },
        {
          label: 'Startup stage',
          accessorKey: 'startup.stage'
        },
        {
          label: 'Type',
          accessorKey: 'startup.type'
        },
        {
          label: 'About company',
          accessorKey: 'startup.description'
        },
        {
          label: 'Data room drive link',
          accessorKey: 'startup.dataRoomGDriveLinkPrimary'
        },
        {
          label: 'L1 Due date',
          accessorKey: 'startup.l1DueDate'
        },
        {
          label: 'L2 Due date',
          accessorKey: 'startup.l2DueDate'
        },
        {
          label: 'L2.5 Due date',
          accessorKey: 'startup.l2_5DueDate'
        },
        {
          label: 'L3 due date',
          accessorKey: 'startup.l3DueDate'
        },
        {
          label: 'POC',
          accessorKey: 'startup.poc'
        },
        {
          label: 'Follow on Funding Ready',
          accessorKey: 'startup.followOnFundingReady'
        },
        {
          label: 'Vertical partner',
          accessorKey: 'startup.verticalPartnerId'
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
          accessorKey: 'startup.campusEvaluationScore'
        },
        {
          label: 'Remarks',
          accessorKey: 'startup.remarks'
        },
        {
          label: 'Address',
          accessorKey: 'startup.location'
        },
        {
          label: 'Founders',
          accessorKey: 'startup.founders'
        },
        {
          label: 'Legal Name',
          accessorKey: 'startup.legalName'
        }
      ]}
    />
  );
}
