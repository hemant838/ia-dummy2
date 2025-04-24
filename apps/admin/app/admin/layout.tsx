import * as React from 'react';
import { type Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  getAuthContext,
  getAuthOrganizationContext
} from '@workspace/auth/context';
import { getRedirectToSignIn } from '@workspace/auth/redirect';
import { routes } from '@workspace/routes';
import { SidebarInset } from '@workspace/ui/components/sidebar';

import Breadcrumb from '~/components/admin/breadcrumb';
import { SidebarRenderer } from '~/components/organizations/slug/sidebar-renderer';
import { getOrganizations } from '~/data/organization/get-organizations';
import { createTitle } from '~/lib/formatters';
import { generateBreadcrumbs } from '~/lib/generate-breadcrumbs';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: createTitle('Admin')
};

export default async function DashboardLayout(
  props: NextPageProps & React.PropsWithChildren
): Promise<React.JSX.Element> {
  const ctx = await getAuthOrganizationContext();

  // if (!ctx?.session) {
  //   return redirect(getRedirectToSignIn());
  // }

  const [cookieStore, organizations] = await Promise.all([
    cookies(),
    getOrganizations(),
    () => {}
  ]);

  return (
    <div className="flex flex-col size-full overflow-hidden">
      <Providers
        organization={ctx.organization}
        defaultOpen={
          (cookieStore.get('sidebar:state')?.value ?? 'true') === 'true'
        }
        defaultWidth={cookieStore.get('sidebar:width')?.value}
      >
        <SidebarRenderer
          organizations={organizations}
          favorites={[]}
          profile={{
            ...ctx.session?.user
          }}
        />
        {/* Set max-width so full-width tables can overflow horizontally correctly */}
        <SidebarInset
          id="skip"
          className="size-full gap-y-4 bg-gray-50 lg:[transition:max-width_0.2s_linear] lg:peer-data-[state=collapsed]:max-w-[calc(100svw-var(--sidebar-width-icon))] lg:peer-data-[state=expanded]:max-w-[calc(100svw-var(--sidebar-width))]"
        >
          <header className="flex h-[56px] items-center justify-between bg-white p-4">
            <h1 className="text-2xl text-gray-700">Admin Dashboard</h1>
          </header>

          <section className="relative w-full h-full p-3">
            <Breadcrumb />
            {props.children}
          </section>
        </SidebarInset>
      </Providers>
    </div>
  );
}
