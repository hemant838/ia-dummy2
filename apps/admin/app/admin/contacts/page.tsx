import * as React from 'react';
import { type Metadata } from 'next';
import { LogIn } from 'lucide-react';

import { getJWTToken } from '@workspace/auth/jwtAccessToken';
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
      tabFilterByKey="userType"
      tabFilters={[
        {
          label: 'All',
          value: 'all'
        },
        {
          label: 'Founders',
          value: 'FOUNDER'
        },
        {
          label: 'Mentors',
          value: 'MENTOR'
        },
        {
          label: 'Corporate Partners',
          value: 'INVESTOR'
        },
        {
          label: 'Our People',
          value: 'STAFF'
        }
      ]}
      tableColumn={[
        {
          label: 'Name',
          accessorKey: 'name'
        },
        {
          label: 'Thesis',
          accessorKey: 'founderProfile.startup.thesisName',
          type: 'tag'
        },
        {
          label: 'Email',
          accessorKey: 'email',
          type: 'email'
        },
        {
          label: 'Domain',
          accessorKey: 'founderProfile.startup.website',
          type: 'url'
        },
        {
          label: 'Contact number',
          accessorKey: 'phone',
          type: 'phone'
        }
      ]}
    />
  );
}
