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

export async function updateApplicationById(
  id: string,
  payload: any = {}
): Promise<string | undefined> {
  try {
    const data: any = await apiClient(`/startup-application/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    if (!data?.status) {
      throw new NotFoundError('Something went wrong');
    }

    let result = data.data;

    return result;
  } catch (error) {
    throw error;
  }
}
