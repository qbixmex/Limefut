'use server';

import { cookies } from 'next/headers';
import {
  loginWithNestApi,
  mapNestRoles,
  NEST_ACCESS_TOKEN_COOKIE,
  NEST_SESSION_MODE_COOKIE,
} from '@/lib/nest-api';
import type { ROLE_TYPE } from '@/shared/interfaces';

export type SignInActionResult = {
  ok: boolean;
  message: string;
  roles?: ROLE_TYPE[];
};

export const signInAction = async (
  formData: FormData,
): Promise<SignInActionResult> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rememberMe = formData.get('rememberMe') !== 'false';

  if (!email || !password) {
    return {
      ok: false,
      message: '¡ El correo y la contraseña son obligatorios !',
    };
  }

  try {
    const login = await loginWithNestApi(email, password);

    if (!login.ok) {
      return { ok: false, message: login.message };
    }

    const roles = mapNestRoles(login.user.roles);

    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: rememberMe ? 60 * 60 : undefined,
    };

    cookieStore.set(NEST_ACCESS_TOKEN_COOKIE, login.token, cookieOptions);
    cookieStore.set(
      NEST_SESSION_MODE_COOKIE,
      rememberMe ? 'persistent' : 'session',
      cookieOptions,
    );

    return {
      ok: true,
      message: login.message,
      roles,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      ok: false,
      message: '¡ Error desconocido, revise los logs del servidor ❌ !',
    };
  }
};
