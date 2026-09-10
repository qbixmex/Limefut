import { callNestApi } from '@/lib/nest-api';

type DeleteUserApiResponse = {
  statusCode?: number;
  message?: string;
  error?: string;
};

export type DeleteUserApiResult = Promise<{
  ok: boolean;
  message: string;
  statusCode?: number;
}>;

export const deleteUserApi = async (
  userId: string,
  token?: string | null,
): DeleteUserApiResult => {
  const response = await callNestApi<DeleteUserApiResponse>(
    `/users/${userId}`,
    {
      method: 'DELETE',
    },
    token,
  );

  if (!response.ok) {
    const message =
      response.data?.message ??
      response.data?.error ??
      '¡ No se pudo eliminar el usuario !';

    return {
      ok: false,
      message,
      statusCode: response.status,
    };
  }

  return {
    ok: true,
    statusCode: response.status,
    message: response.data?.message ?? '¡ Usuario eliminado satisfactoriamente 👍 !',
  };
};
