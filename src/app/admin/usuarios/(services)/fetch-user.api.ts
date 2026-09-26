'use server';

import { callNestApi } from '@/lib/nest-api';
import type { USER_ROLES_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

export type User = {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  emailVerified: boolean;
  imageUrl: string | null;
  isActive: boolean;
  roles: USER_ROLES_TYPE[];
  createdAt: Date;
  updatedAt: Date;
};

type UserApiResponse = {
  statusCode: number;
  message: string;
  user: User;
};

export type FetchUserApiResult = Promise<{
  ok: boolean;
  message: string;
  user: User | null
}>;

export const fetchUserApi = async (
  id: string,
  token: string | null,
): FetchUserApiResult => {
  'use cache';

  cacheLife('max');
  cacheTag('admin-user');

  const response = await callNestApi<UserApiResponse>(
    `/users/${id}`,
    undefined,
    token,
  );

  if (!response.ok) {
    const message =
      response.data?.message ??
      'No se pudo obtener el usuario';

    return {
      ok: false,
      message,
      user: null,
    };
  }

  return {
    ok: true,
    message: response.data!.message,
    user: response.data!.user,
  };
};
