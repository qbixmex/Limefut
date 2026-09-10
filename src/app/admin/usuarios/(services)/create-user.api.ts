import { callNestApi } from '@/lib/nest-api';
import type { USER_ROLES_TYPE } from '@/shared/enums';
import type { User } from '@/shared/interfaces';

export type CreateUserApiInput = {
  email: string;
  password: string;
  name?: string;
  username?: string;
  isActive?: boolean;
  roles?: USER_ROLES_TYPE[];
};

type CreateUserApiResponse = {
  statusCode?: number;
  message?: string;
  error?: string;
  user: User;
};

export type CreateUserApiResult = Promise<{
  ok: boolean;
  message: string;
  statusCode?: number;
  user: User | null;
}>;

export const createUserApi = async (
  data: CreateUserApiInput,
  token?: string | null,
): CreateUserApiResult => {
  const response = await callNestApi<CreateUserApiResponse>(
    '/users',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token,
  );

  if (!response.ok || !response.data?.user) {
    const message =
      response.data?.message ??
      response.data?.error ??
      '¡ No se pudo crear el usuario !';

    return {
      ok: false,
      message,
      statusCode: response.status,
      user: null,
    };
  }

  return {
    ok: true,
    statusCode: response.data.statusCode,
    message: response.data.message ?? '¡ Usuario creado correctamente 👍 !',
    user: response.data.user,
  };
};
