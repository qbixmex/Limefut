'use server';

import { redirect } from 'next/navigation';
import { updateTag } from 'next/cache';
import { editUserSchema } from '@/shared/schemas';
import type { User } from '@/shared/interfaces';
import { requireAdmin } from '@/lib/get-session';
import { getNestAccessToken } from '@/lib/nest-api';
import { isPasswordInsecure } from '@/lib/passwords_check';
import { ROUTES } from '@/shared/constants/routes';
import { updateUserApi, type UpdateUserApiInput } from '../(services)';

export type ResponseUpdateAction = Promise<{
  ok: boolean;
  message: string;
  statusCode?: number;
  user: User | null;
}>;

export const updateUserAction = async (
  formData: FormData,
  userId: string,
): ResponseUpdateAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
      user: null,
    };
  }

  const imageFile = formData.get('image');

  const rawData = {
    name: formData.get('name') ?? '',
    username: formData.get('username') ?? '',
    email: formData.get('email') ?? '',
    image: (imageFile instanceof File && imageFile.size > 0)
      ? imageFile
      : null,
    password: formData.get('password') ?? '',
    passwordConfirmation: formData.get('passwordConfirmation') ?? '',
    roles: formData.get('roles')
      ? JSON.parse(formData.get('roles') as string)
      : [],
    isActive: formData.get('isActive') === 'true',
  };

  const userVerified = editUserSchema.safeParse(rawData);

  if (!userVerified.success) {
    return {
      ok: false,
      message: userVerified.error.message,
      user: null,
    };
  }

  if (
    userVerified.data.password && userVerified.data.password !== '' &&
    isPasswordInsecure(userVerified.data.password)
  ) {
    return {
      ok: false,
      message: '¡ La contraseña es insegura, elija otra por favor !',
      user: null,
    };
  }

  const dataToApi = Object.fromEntries(
    Object.entries(userVerified.data).filter(
      ([key, value]) =>
        key !== 'passwordConfirmation' &&
        key !== 'image' &&
        !(key === 'password' && !value),
    ),
  );

  const token = await getNestAccessToken();

  const result = await updateUserApi(
    userId,
    dataToApi as UpdateUserApiInput,
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
