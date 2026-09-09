'use server';

import { cookies } from 'next/headers';
import { NEST_ACCESS_TOKEN_COOKIE, NEST_SESSION_MODE_COOKIE } from '@/lib/nest-api';

export const signOutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(NEST_ACCESS_TOKEN_COOKIE);
  cookieStore.delete(NEST_SESSION_MODE_COOKIE);

  return {
    message: '¡ Has cerrado sesión correctamente 👍 !',
  };
};
