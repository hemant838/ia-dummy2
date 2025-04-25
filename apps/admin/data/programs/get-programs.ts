import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { NotFoundError } from '@workspace/common/errors';

// import {
//   Caching,
//   defaultRevalidateTimeInSeconds,
//   OrganizationCacheKey
// } from '~/data/caching';

export async function getPrograms(): Promise<string | undefined> {
  const token = await getJWTToken();

  return cache(
    async () => {
      const programs: any = [
        {
          programTitle: 'Program Title 1',
          startDate: '9/23/16',
          endDate: '9/23/16',
          applicationNo: '23',
          status: 'PENDING',
          actions: null
        },
        {
          programTitle: 'Program Title 2',
          startDate: '9/23/16',
          endDate: '9/23/16',
          applicationNo: '23',
          status: 'PENDING',
          actions: null
        }
      ]; // api call data

      if (!programs) {
        throw new NotFoundError('Organization not found');
      }

      return programs;
    }
    // Caching.createOrganizationKeyParts(
    //   OrganizationCacheKey.OrganizationLogo,
    //   ctx.organization.id
    // ),
    // {
    //   revalidate: defaultRevalidateTimeInSeconds,
    //   tags: [
    //     Caching.createOrganizationTag(
    //       OrganizationCacheKey.OrganizationLogo,
    //       ctx.organization.id
    //     )
    //   ]
    // }
  )();
}
