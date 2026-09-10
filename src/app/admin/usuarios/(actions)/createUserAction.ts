'use server';

import { redirect } from 'next/navigation';
import { createUserSchema } from '@/shared/schemas';
import { updateTag } from 'next/cache';
import type { User } from '@/shared/interfaces';
import { requireAdmin } from '@/lib/get-session';
import { getNestAccessToken } from '@/lib/nest-api';
import { ROUTES } from '@/shared/constants/routes';
import { createUserApi, type CreateUserApiInput } from '../(services)';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  statusCode?: number;
  user: User | null;
}>;

export const createUserAction = async (
  formData: FormData,
): CreateResponseAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
      user: null,
    };
  }

  const rawData = {
    name: formData.get('name') as string,
    username: formData.get('username') ?? '',
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    passwordConfirmation: formData.get('passwordConfirmation') as string,
    roles: JSON.parse(formData.get('roles') as string),
    isActive: formData.get('isActive') === 'true',
  };

  const userVerified = createUserSchema.safeParse(rawData);

  if (!userVerified.success) {
    return {
      ok: false,
      message: userVerified.error.message,
      user: null,
    };
  }

  const token = await getNestAccessToken();

  const dataToApi = Object.fromEntries(
    Object.entries(userVerified.data).filter(
      ([key]) => key !== 'passwordConfirmation' && key !== 'image',
    ),
  );

  const result = await createUserApi(
    dataToApi as CreateUserApiInput,
    token,
  );

  if (result.statusCode === 401) {
    redirect(ROUTES.AUTH_LOGIN);
  }

  if (result.ok) {
    updateTag('admin-users');
    updateTag('admin-user');
  }

  return result;
};
