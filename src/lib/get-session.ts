'use server';

import { cache } from 'react';
import { headers } from 'next/headers';
import { auth } from './auth';

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export type RequireAdminResult =
  | { ok: true; session: NonNullable<Awaited<ReturnType<typeof getSession>>> }
  | { ok: false; message: string };

export const requireAdmin = async (): Promise<RequireAdminResult> => {
  const session = await getSession();

  if (!session?.user) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
    };
  }

  if (!session.user.roles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
    };
  }

  return { ok: true, session };
};
