'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { baseUrl, getPathname } from '@workspace/routes';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarGroupProps
} from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { createMainNavItems } from '~/components/organizations/slug/nav-items';
import { useActiveOrganization } from '~/hooks/use-active-organization';

export function NavMain(props: SidebarGroupProps): React.JSX.Element {
  const pathname = usePathname();
  const activeOrganization = useActiveOrganization();
  return (
    <SidebarGroup
      className="px-0"
      {...props}
    >
      <SidebarMenu>
        {createMainNavItems(activeOrganization.slug).map((item, index) => {
          const isActive = pathname.startsWith(
            getPathname(item.href, baseUrl.Dashboard)
          );
          return (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="rounded-none text-sm font-normal"
                tooltip={item.title}
              >
                <Link
                  href={item.disabled ? '~/' : item.href}
                  target={item.external ? '_blank' : undefined}
                  className={cn(
                    'px-3 relative',
                    isActive ? 'text-slate-800' : 'text-slate-600'
                  )}
                >
                  {isActive && (
                    <div className="absolute h-full w-[2px] left-0 top-0 bg-primary" />
                  )}
                  <item.icon
                    className={cn(
                      'size-4 shrink-0',
                      isActive ? 'text-slate-800' : 'text-slate-600'
                    )}
                  />
                  <span
                    className={
                      isActive
                        ? 'dark:text-foreground'
                        : 'dark:text-muted-foreground'
                    }
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
