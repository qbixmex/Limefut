import { callNestApi } from '@/lib/nest-api';
import type { USER_ROLES_TYPE } from '@/shared/enums';
import type { Pagination } from '@/shared/interfaces';

export type User = {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  emailVerified: string;
  imageUrl: string | null;
  roles: USER_ROLES_TYPE[];
  isActive: boolean;
};

type UsersApiResponse = {
  statusCode?: number;
  message?: string;
  users: User[];
  pagination?: Pagination;
};

type Options = Readonly<{
  searchTerm?: string;
  page?: number;
  take?: number;
}>;

export type FetchUsersApiResult = Promise<{
  ok: boolean;
  message: string;
  users: User[] | null;
  pagination: Pagination | null;
}>;

export const fetchUsersApi = async (
  options?: Options,
  token?: string | null,
): FetchUsersApiResult => {
  const { searchTerm, page, take } = options ?? {};

  const isPositiveInteger = (value: number | undefined): boolean => {
    return value === undefined || (Number.isInteger(value) && value > 0);
  };

  if (!isPositiveInteger(page) || !isPositiveInteger(take)) {
    return {
      ok: false,
      message: '¡ Los parámetros deben ser números válidos !',
      users: null,
      pagination: null,
    };
  }

  const params = new URLSearchParams();
  if (page !== undefined) params.set('page', String(page));
  if (take !== undefined) params.set('take', String(take));
  if (searchTerm !== undefined) params.set('search_term', searchTerm);
  const query = params.toString();

  const result = await callNestApi<UsersApiResponse>(
    `/users${query ? `?${query}` : ''}`,
    undefined,
    token,
  );

  if (!result.ok || !result.data?.users) {
    const message =
      result.data?.message ??
      '¡ No se pudieron obtener los usuarios !';

    return {
      ok: false,
      message,
      users: null,
      pagination: null,
    };
  }

  const { users, pagination } = result.data;
  const mappedUsers = users.map((user) => ({
    ...user,
    roles: user.roles ?? [],
  }));

  return {
    ok: true,
    message: '! Los usuarios fueron obtenidos satisfactoriamente 👍',
    users: mappedUsers,
    pagination: pagination ?? null,
  };
};
