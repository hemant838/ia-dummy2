import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthContext } from '@workspace/auth/context';
// import { prisma } from '@workspace/database/client';
import { getJWTToken } from '@workspace/auth/jwtAccessToken';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  UserCacheKey
} from '~/data/caching';
import type { OrganizationDto } from '~/types/dtos/organization-dto';

export async function getOrganizations(): Promise<OrganizationDto[]> {
  const ctx = await getAuthContext();

  const tokenUser = await getJWTToken();
  const { jwtToken } = tokenUser;

  return cache(
    async () => {
      const orgResponse: any = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/v1/api/organization?userId=${tokenUser.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`
          }
        }
      );

      const organizationData: any = await orgResponse.json();

      const organizations = organizationData?.data?.data;

      const response: OrganizationDto[] = organizations.map(
        (organization: any) => ({
          id: organization.id,
          logo: organization.logo ? organization.logo : undefined,
          name: organization.name,
          slug: organization.name
            ? organization.name?.toLowerCase()?.trim()?.replace(/\s+/g, '-')
            : undefined,
          memberCount: organization.users.length
        })
      );

      return response;
    },
    Caching.createUserKeyParts(UserCacheKey.Organizations, ctx.session.user.id),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createUserTag(UserCacheKey.Organizations, ctx.session.user.id)
      ]
    }
  )();
}
