'use server';

import { getNestAccessToken } from '@/lib/nest-api';
import { fetchUsersCached } from '../(services)';
import type { User, ResponseFetchAction } from '../(services)';

type Options = Readonly<{
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

export type { User, ResponseFetchAction };

export const fetchUsersAction = async (options?: Options): ResponseFetchAction => {
  const token = await getNestAccessToken();
  const { page, take } = options ?? {};

  return fetchUsersCached({ page, take, token });
};
