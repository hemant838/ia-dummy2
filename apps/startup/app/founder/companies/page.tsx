import * as React from 'react';
import { type Metadata } from 'next';

// import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { APP_NAME } from '@workspace/common/app';

import PageRenderer from '~/components/main/pageRenderer';
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
      readOnly={true}
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
              value: 'APPLICATION_RECEIVED',
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
              value: 'INVESTMENT_COMPLETED',
              color: { bg: 'bg-lime-50', border: 'border-lime-100' }
            },
            {
              label: 'On hold',
              value: 'OH_HOLD',
              color: { bg: 'bg-purple-50', border: 'border-purple-100' }
            },
            {
              label: 'Dropped',
              value: 'DROPPED',
              color: { bg: 'bg-orange-50', border: 'border-orange-100' }
            },
            {
              label: 'No value',
              value: 'NO_VALUE',
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
          type: 'text-tag',
          option: [
            {
              label: 'Seed',
              value: 'SEED',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Series A',
              value: 'SERIES_A',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Series B',
              value: 'SERIES_B',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Series C',
              value: 'SERIES_C',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Angel',
              value: 'ANGEL',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Convertible Note',
              value: 'CONVERTIBLE_NOTE',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'SAFE',
              value: 'SAFE',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            }
          ]
        },
        {
          label: 'Domain/Industry',
          accessorKey: 'startupIndustryDomain',
          type: 'url'
        },
        {
          label: 'Startup source',
          accessorKey: 'startupSource',
          type: 'icon-tag',
          option: [
            {
              label: 'Campus Institute',
              value: 'CAMPUS_INSTITUTE',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Core Team',
              value: 'CORE_TEAM',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Mentors',
              value: 'MENTORS',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Peer Founders',
              value: 'PEER_FOUNDERS',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            ,
            {
              label: 'Linkedin',
              value: 'LINKEDIN',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Co-working',
              value: 'COWORKING',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Website inbound',
              value: 'WEBSITE_INBOUND',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Events',
              value: 'EVENTS',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Application form',
              value: 'APPLICATION_FORM',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'traxcn',
              value: 'TRAXCN',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'others',
              value: 'OTHERS',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'No source',
              value: 'NO_SOURCE',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            }
          ]
        },
        {
          label: 'Referred by',
          accessorKey: 'referredBy.name',
          type: 'avatar'
        },
        {
          label: 'Startup stage',
          accessorKey: 'stage',
          type: 'select',
          option: [
            {
              label: 'Idea',
              value: 'IDEA',
              color: { bg: 'bg-gray-50', border: 'border-gray-100' }
            },
            {
              label: 'MVP',
              value: 'MVP',
              color: { bg: 'bg-yellow-50', border: 'border-yellow-100' }
            },
            {
              label: 'Early Traction',
              value: 'EARLY_TRACTION',
              color: { bg: 'bg-green-50', border: 'border-green-100' }
            },
            {
              label: 'Scaling',
              value: 'SCALING',
              color: { bg: 'bg-blue-50', border: 'border-blue-100' }
            },
            {
              label: 'Acceleration',
              value: 'ACCELERATION',
              color: { bg: 'bg-purple-50', border: 'border-purple-100' }
            },
            {
              label: 'Growth',
              value: 'GROWTH',
              color: { bg: 'bg-cyan-50', border: 'border-cyan-100' }
            },
            {
              label: 'PMF',
              value: 'PMF',
              color: { bg: 'bg-orange-50', border: 'border-orange-100' }
            },
            {
              label: 'Pre Product',
              value: 'PRE_PRODUCT',
              color: { bg: 'bg-lime-50', border: 'border-lime-100' }
            },
            {
              label: 'Pre Revenue',
              value: 'PRE_REVENUE',
              color: { bg: 'bg-red-50', border: 'border-red-100' }
            }
          ]
        },
        {
          label: 'Type',
          accessorKey: 'type',
          type: 'text-tag',
          option: [
            {
              label: 'Portfolio Company',
              value: 'PORTFOLIO_COMPANY',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Co-working',
              value: 'COWORKING',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'External Client',
              value: 'EXTERNAL_CLIENT',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'Funding Applicant',
              value: 'FUNDING_APPLICANT',
              color: { bg: 'bg-gray-50', border: 'border-0' }
            }
          ]
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
          type: 'boolean',
          option: [
            {
              label: 'True',
              value: true,
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'False',
              value: false,
              color: { bg: 'bg-gray-50', border: 'border-0' }
            }
          ]
        },
        {
          label: 'Follow on Funding Ready',
          accessorKey: 'followOnFundingReady',
          type: 'boolean',
          option: [
            {
              label: 'True',
              value: true,
              color: { bg: 'bg-gray-50', border: 'border-0' }
            },
            {
              label: 'False',
              value: false,
              color: { bg: 'bg-gray-50', border: 'border-0' }
            }
          ]
        },
        {
          label: 'Vertical partner',
          accessorKey: 'verticalPartnerName',
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
