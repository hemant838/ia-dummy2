import {
  BellIcon,
  CalendarHeart,
  CodeIcon,
  CreditCardIcon,
  Files,
  FileText,
  GraduationCap,
  LayoutGrid,
  LockKeyholeIcon,
  StoreIcon,
  UserCog,
  UserIcon,
  UserPlus2Icon,
  UserSearch
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { replaceOrgSlug, routes } from '@workspace/routes';

type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon: LucideIcon;
};

export function createMainNavItems(slug: string): NavItem[] {
  return [
    {
      title: 'Profile',
      href: routes.dashboard.startup.routes.Index,
      icon: LayoutGrid
    },
    {
      title: 'Programs',
      href: routes.dashboard.startup.routes.programs.Index,
      icon: CalendarHeart
    },
    {
      title: 'Applications',
      href: routes.dashboard.startup.routes.Applications,
      icon: FileText
    },
    {
      title: 'Recommended Startup',
      href: routes.dashboard.startup.routes.Thesis,
      icon: GraduationCap
    },
    {
      title: 'Resources',
      href: routes.dashboard.startup.routes.Companies,
      icon: Files
    },
    {
      title: 'Mentorship',
      href: routes.dashboard.startup.routes.Contacts,
      icon: UserCog
    },
    {
      title: 'Search Co-Founders',
      href: routes.dashboard.startup.routes.Contacts,
      icon: UserSearch
    }
  ];
}

export function createAccountNavItems(slug: string): NavItem[] {
  return [
    {
      title: 'Profile',
      href: replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.account.Profile,
        slug
      ),
      icon: UserIcon
    },
    {
      title: 'Security',
      href: replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.account.Security,
        slug
      ),
      icon: LockKeyholeIcon
    },
    {
      title: 'Notifications',
      href: replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.account.Notifications,
        slug
      ),
      icon: BellIcon
    }
  ];
}

export function createOrganizationNavItems(slug: string): NavItem[] {
  return [
    {
      title: 'General',
      href: replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.organization.General,
        slug
      ),
      icon: StoreIcon
    },
    {
      title: 'Members',
      href: replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.organization.Members,
        slug
      ),
      icon: UserPlus2Icon
    },
    {
      title: 'Billing',
      href: replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.organization.Billing,
        slug
      ),
      icon: CreditCardIcon
    },
    {
      title: 'Developers',
      href: replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.organization.Developers,
        slug
      ),
      icon: CodeIcon
    }
  ];
}
