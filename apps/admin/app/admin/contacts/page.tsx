import * as React from 'react';
import { type Metadata } from 'next';
import { LogIn } from 'lucide-react';

// import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { APP_NAME } from '@workspace/common/app';
import { routes } from '@workspace/routes';

import PageRenderer from '~/components/admin/pageRenderer';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle(`Contacts | ${APP_NAME}`)
};

export default async function ContactsPage(): Promise<React.JSX.Element> {
  return (
    <PageRenderer
      pageTitle="Contacts"
      pageName="contacts"
      apiEndpoint="contacts"
      showTabFilters={true}
      tabFilters={[
        {
          label: 'Founders',
          value: 'founder'
        },
        {
          label: 'Mentors',
          value: 'mentors'
        },
        {
          label: 'Corporate Partners',
          value: 'corporate_partners'
        },
        {
          label: 'Our People',
          value: 'our_people'
        }
      ]}
      tableColumn={[
        {
          label: 'Name',
          accessorKey: 'name'
        },
        {
          label: 'Thesis',
          accessorKey: 'program.name'
        },
        {
          label: 'Email',
          accessorKey: 'email'
        },
        {
          label: 'Domain',
          accessorKey: 'evaluationStage'
        },
        {
          label: 'Contact number',
          accessorKey: 'phone'
        }
      ]}
    />
  );
}
