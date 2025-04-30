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
          label: 'Startup',
          accessorKey: 'startup.name'
        },
        {
          label: 'Thesis',
          accessorKey: 'startup.thesis.name',
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
          accessorKey: 'startup.investmentType',
          type: 'text'
        },
        {
          label: 'Domain/Industry',
          accessorKey: 'startup.startupIndustryDomain',
          type: 'url'
        },
        {
          label: 'Startup source',
          accessorKey: 'startup.startupSource',
          type: 'icon-tag'
        },
        {
          label: 'Referred by',
          accessorKey: 'startup.referredBy.name',
          type: 'avatar'
        },
        {
          label: 'Startup stage',
          accessorKey: 'startup.stage',
          type: 'tag'
        },
        {
          label: 'Type',
          accessorKey: 'startup.type',
          type: 'text'
        },
        {
          label: 'About company',
          accessorKey: 'startup.description',
          type: 'text'
        },
        {
          label: 'Data room drive link',
          accessorKey: 'startup.dataRoomGDriveLinkPrimary',
          type: 'url'
        },
        {
          label: 'L1 Due date',
          accessorKey: 'startup.l1DueDate',
          type: 'date'
        },
        {
          label: 'L2 Due date',
          accessorKey: 'startup.l2DueDate',
          type: 'date'
        },
        {
          label: 'L2.5 Due date',
          accessorKey: 'startup.l2_5DueDate',
          type: 'date'
        },
        {
          label: 'L3 due date',
          accessorKey: 'startup.l3DueDate',
          type: 'date'
        },
        {
          label: 'POC',
          accessorKey: 'startup.poc',
          type: 'text'
        },
        {
          label: 'Follow on Funding Ready',
          accessorKey: 'startup.followOnFundingReady',
          type: 'text'
        },
        {
          label: 'Vertical partner',
          accessorKey: 'startup.verticalPartnerName',
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
          accessorKey: 'startup.campusEvaluationScore',
          type: 'text'
        },
        {
          label: 'Remarks',
          accessorKey: 'startup.remarks',
          type: 'text'
        },
        {
          label: 'Address',
          accessorKey: 'startup.location',
          type: 'text'
        },
        {
          label: 'Founders',
          accessorKey: 'startup.founders',
          type: 'avatar'
        },
        {
          label: 'Legal Name',
          accessorKey: 'startup.legalName',
          type: 'text'
        }
      ]}
    />
  );
}
