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
          type: 'select',
          option: [
            {
              label: 'Application received',
              value: 'application_received',
              color: { bg: 'bg-green-50', border: 'border-green-100' }
            },
            {
              label: 'L1',
              value: 'L1',
              color: { bg: 'bg-cyan-50', border: 'border-cyan-100' }
            },
            {
              label: 'L2',
              value: 'L2',
              color: { bg: 'bg-yellow-50', border: 'border-yellow-100' }
            },
            {
              label: 'L2.5',
              value: 'L2.5',
              color: { bg: 'bg-orange-50', border: 'border-orange-100' }
            },
            {
              label: 'L3',
              value: 'L3',
              color: { bg: 'bg-lime-50', border: 'border-lime-100' }
            },
            {
              label: 'L4',
              value: 'L4',
              color: { bg: 'bg-red-50', border: 'border-red-100' }
            },
            {
              label: 'Investment completed',
              value: 'investment_completed',
              color: { bg: 'bg-lime-50', border: 'border-lime-100' }
            },
            {
              label: 'On hold',
              value: 'on_hold',
              color: { bg: 'bg-purple-50', border: 'border-purple-100' }
            },
            {
              label: 'Dropped',
              value: 'dropped',
              color: { bg: 'bg-orange-50', border: 'border-orange-100' }
            },
            {
              label: 'No value',
              value: 'no_value',
              color: { bg: 'bg-gray-50', border: 'border-gray-100' }
            },
            {
              label: 'Rejected',
              value: 'rejected',
              color: { bg: 'bg-red-50', border: 'border-red-100' }
            }
          ]
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
          type: 'text'
        },
        {
          label: 'Follow on Funding Ready',
          accessorKey: 'followOnFundingReady',
          type: 'text'
        },
        {
          label: 'Vertical partner',
          accessorKey: 'verticalPartnerId',
          type: 'text'
        },
        {
          label: 'Creation date',
          accessorKey: 'createdAt',
          type: 'text'
        },
        {
          label: 'Created by',
          accessorKey: 'createdBy',
          type: 'text'
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
          type: 'text'
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
