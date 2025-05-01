import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';

import { formatDate } from '~/lib/formatters';
// import { apiClient } from '@workspace/api-client';
import { apiClient } from '../../../../packages/api-client/src/api-client';

// import {
//   Caching,
//   defaultRevalidateTimeInSeconds,
//   OrganizationCacheKey
// } from '~/data/caching';

export async function getAllStartups(
  page: number = 1,
  pageSize: number = 8
): Promise<string | undefined> {
  try {
    const data: any = await apiClient(
      `/startup?page=${page}&pageSize=${pageSize}&evaluationStage=${'INVESTMENT_COMPLETED'}`,
      {
        method: 'GET'
      }
    );

    if (!data?.status) {
      throw new NotFoundError('Something went wrong');
    }

    let result = data.data;

    const formattedData = result.data.map((item: any) => {
      return {
        ...item,
        createdAt: formatDate(item?.createdAt),
        updatedAt: formatDate(item?.updatedAt)
      };
    });

    result = {
      ...result,
      data: formattedData
    };

    return result;

    // return cache(
    //   async () => {
    //     let result = data.data;

    //     const formattedData = result.data.map((item: any) => {
    //       return {
    //         ...item,
    //         applicationDeadline: formatDate(item?.applicationDeadline),
    //         startDate: formatDate(item?.startDate),
    //         endDate: formatDate(item?.endDate),
    //         createdAt: formatDate(item?.createdAt),
    //         updatedAt: formatDate(item?.updatedAt),
    //         totalApplication: item?.StartupApplication?.length,
    //         status: 'Pending'
    //       };
    //     });

    //     result = {
    //       ...result,
    //       data: formattedData
    //     };

    //     console.log('formattedData', result);

    //     return result;
    //   }
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
    // )();
  } catch (error) {
    throw error;
  }

  // return cache(
  //   async () => {
  //     const programs: any = [
  //       {
  //         programTitle: 'Program Title 1',
  //         startDate: '9/23/16',
  //         endDate: '9/23/16',
  //         applicationNo: '23',
  //         status: 'PENDING',
  //         actions: null
  //       },
  //       {
  //         programTitle: 'Program Title 2',
  //         startDate: '9/23/16',
  //         endDate: '9/23/16',
  //         applicationNo: '23',
  //         status: 'PENDING',
  //         actions: null
  //       }
  //     ]; // api call data

  //     if (!programs) {
  //       throw new NotFoundError('Organization not found');
  //     }

  //     return programs;
  //   }
  //   // Caching.createOrganizationKeyParts(
  //   //   OrganizationCacheKey.OrganizationLogo,
  //   //   ctx.organization.id
  //   // ),
  //   // {
  //   //   revalidate: defaultRevalidateTimeInSeconds,
  //   //   tags: [
  //   //     Caching.createOrganizationTag(
  //   //       OrganizationCacheKey.OrganizationLogo,
  //   //       ctx.organization.id
  //   //     )
  //   //   ]
  //   // }
  // )();
}
