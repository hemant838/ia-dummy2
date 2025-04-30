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
          label: 'Startup',
          accessorKey: 'name'
        },
        {
          label: 'Thesis',
          accessorKey: 'thesis.name',
          type: 'tag'
        },
        {
          label: 'Evaluation stages',
          accessorKey: 'evaluationStage',
          type: 'tag'
        },
        {
          label: 'Investment type',
          accessorKey: 'investmentType',
          type: 'text'
        },
        {
          label: 'Domain/Industry',
          accessorKey: 'startupIndustryDomain',
          type: 'url'
        },
        {
          label: 'Startup source',
          accessorKey: 'startupSource',
          type: 'tag'
        },
        {
          label: 'Referred by',
          accessorKey: 'referredById',
          type: 'avatar'
        },
        {
          label: 'Startup stage',
          accessorKey: 'stage',
          type: 'tag'
        },
        {
          label: 'Type',
          accessorKey: 'type',
          type: 'text'
        },
        {
          label: 'About company',
          accessorKey: 'description',
          type: 'text'
        },
        {
          label: 'Data room drive link',
          accessorKey: 'dataRoomGDriveLinkPrimary',
          type: 'url'
        },
        {
          label: 'L1 Due date',
          accessorKey: 'l1DueDate',
          type: 'date'
        },
        {
          label: 'L2 Due date',
          accessorKey: 'l2DueDate',
          type: 'date'
        },
        {
          label: 'L2.5 Due date',
          accessorKey: 'l2_5DueDate',
          type: 'date'
        },
        {
          label: 'L3 due date',
          accessorKey: 'l3DueDate',
          type: 'date'
        },
        {
          label: 'POC',
          accessorKey: 'poc',
          type: 'avatar'
        },
        {
          label: 'Follow on Funding Ready',
          accessorKey: 'followOnFundingReady',
          type: 'text'
        },
        {
          label: 'Vertical partner',
          accessorKey: 'verticalPartnerId',
          type: 'avatar'
        },
        {
          label: 'Creation date',
          accessorKey: 'createdAt',
          type: 'text'
        },
        {
          label: 'Created by',
          accessorKey: 'createdBy',
          type: 'avatar'
        },
        {
          label: 'Notes',
          accessorKey: 'notes',
          type: 'text'
        },
        {
          label: 'Campus Evaluation Score',
          accessorKey: 'campusEvaluationScore',
          type: 'text'
        },
        {
          label: 'Remarks',
          accessorKey: 'remarks',
          type: 'text'
        },
        {
          label: 'Address',
          accessorKey: 'location',
          type: 'text'
        },
        {
          label: 'Founders',
          accessorKey: 'founders',
          type: 'avatar'
        },
        {
          label: 'Legal Name',
          accessorKey: 'legalName',
          type: 'text'
        }
      ]}
    />
  );
}
