import { cacheLife, cacheTag } from 'next/cache';
import type { Pagination } from '@/shared/interfaces';
import { fetchUsersApi } from './fetch-users.api';
import type { User } from './fetch-users.api';

export type CacheInput = Readonly<{
  page?: number;
  take?: number;
  token?: string | null;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  users: User[] | null;
  pagination: Pagination | null;
}>;

export const fetchUsersCached = async ({
  page,
  take,
  token,
}: CacheInput): ResponseFetchAction => {
  'use cache';

  cacheLife('max');
  cacheTag('admin-users');

  const result = await fetchUsersApi({ page, take }, token);

  return {
    ok: result.ok,
    message: result.message,
    users: result.users,
    pagination: result.pagination,
  };
};
