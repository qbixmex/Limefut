'use server';

import { redirect } from 'next/navigation';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/get-session';
import { getNestAccessToken } from '@/lib/nest-api';
import { ROUTES } from '@/shared/constants/routes';
import { deleteUserApi } from '../(services)';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
  statusCode?: number;
}>;

export const deleteUserAction = async (userId: string): ResponseDeleteAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
    };
  }

  const token = await getNestAccessToken();

  const result = await deleteUserApi(userId, token);

  if (result.statusCode === 401) {
    redirect(ROUTES.AUTH_LOGIN);
  }

  if (result.ok) {
    updateTag('admin-users');
    updateTag('admin-user');
  }

  return result;
};
