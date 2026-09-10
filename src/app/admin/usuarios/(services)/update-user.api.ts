import { callNestApi } from '@/lib/nest-api';
import type { USER_ROLES_TYPE } from '@/shared/enums';
import type { User } from '@/shared/interfaces';

export type UpdateUserApiInput = {
  name?: string | null;
  username?: string | null;
  email?: string;
  password?: string;
  isActive?: boolean;
  roles?: USER_ROLES_TYPE[];
};

type UpdateUserApiResponse = {
  statusCode?: number;
  message?: string;
  error?: string;
  user: User;
};

export type UpdateUserApiResult = Promise<{
  ok: boolean;
  message: string;
  statusCode?: number;
  user: User | null;
}>;

export const updateUserApi = async (
  userId: string,
  data: UpdateUserApiInput,
  token?: string | null,
): UpdateUserApiResult => {
  const result = await callNestApi<UpdateUserApiResponse>(
    `/users/${userId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    token,
  );

  if (!result.ok || !result.data?.user) {
    const message =
      result.data?.message ??
      result.data?.error ??
      '¡ No se pudo actualizar el usuario !';

    return {
      ok: false,
      message,
      statusCode: result.status,
      user: null,
    };
  }

  return {
    ok: true,
    statusCode: result.data.statusCode,
    message: result.data.message ?? '¡ Usuario actualizado exitosamente 👍 !',
    user: result.data.user,
  };
};
