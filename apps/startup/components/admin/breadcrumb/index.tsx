'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@workspace/ui/components/breadcrumb';

import { generateBreadcrumbs } from '~/lib/generate-breadcrumbs';

export type BreadcrumbItemType = {
  label: string;
  href?: string; // Optional for non-clickable items
};

interface AdminBreadcrumbProps {
  items?: BreadcrumbItemType[];
}

const Breadcrumb: React.FC<AdminBreadcrumbProps> = () => {
  const pathname = usePathname(); // Get the current path
  const breadcrumbItems = generateBreadcrumbs(pathname) || [];

  if (pathname === '/admin/dashboard') {
    return <></>;
  }

  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {/* Add a separator unless it's the last item */}
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
};

export default Breadcrumb;
