'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { fetchUserApi, type User } from './fetch-user.api';

export type CacheInput = Readonly<{
  id: string;
  token: string | null;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message?: string;
  user: User | null;
}>;

export const fetchUserCached = async ({ id, token }: CacheInput): ResponseFetchAction => {
  'use cache';

  cacheLife('max');
  cacheTag('admin-user');

  const result = await fetchUserApi(id, token);

  return {
    ok: result.ok,
    user: result.user,
  };
};
