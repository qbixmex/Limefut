'use server';

import { cache } from 'react';
import { cookies } from 'next/headers';
import {
  checkNestTokenStatus,
  getNestAccessToken,
  mapNestRoles,
  NEST_ACCESS_TOKEN_COOKIE,
  NEST_SESSION_MODE_COOKIE,
  type NestAuthUser,
} from './nest-api';

export type AuthSession = {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
    emailVerified: boolean;
    roles: string[];
    image: string | null;
  };
  session: {
    token: string;
    createdAt: string;
    expiresAt: string | null;
    userAgent: string | null;
  };
};

type SessionPayload = {
  session: AuthSession;
  freshToken: string;
};

const toAuthSession = (user: NestAuthUser, freshToken: string): AuthSession => ({
  user: {
    id: user.id,
    name: user.name,
    username: user.username ?? null,
    email: user.email,
    emailVerified: true,
    roles: mapNestRoles(user.roles),
    image: user.imageUrl,
  },
  session: {
    token: freshToken,
    createdAt: user.createdAt,
    expiresAt: null,
    userAgent: null,
  },
});

const getSessionPayload = cache(async (): Promise<SessionPayload | null> => {
  const token = await getNestAccessToken();

  if (!token) {
    return null;
  }

  const check = await checkNestTokenStatus(token);

  if (!check.ok || check.user.isActive === false) {
    return null;
  }

  return {
    session: toAuthSession(check.user, check.token),
    freshToken: check.token,
  };
});

export const getSession = cache(async (): Promise<AuthSession | null> => {
  const payload = await getSessionPayload();
  return payload?.session ?? null;
});

export type RequireAdminResult =
  | { ok: true; session: AuthSession }
  | { ok: false; message: string };

export const requireAdmin = async (): Promise<RequireAdminResult> => {
  const payload = await getSessionPayload();

  if (!payload?.session.user) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
    };
  }

  if (!payload.session.user.roles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
    };
  }

  await rotateIfPersistent(payload.freshToken);

  return { ok: true, session: payload.session };
};

const rotateIfPersistent = async (freshToken: string): Promise<void> => {
  const cookieStore = await cookies();
  const mode = cookieStore.get(NEST_SESSION_MODE_COOKIE)?.value;

  if (mode !== 'persistent') {
    return;
  }

  cookieStore.set(NEST_ACCESS_TOKEN_COOKIE, freshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });

  cookieStore.set(NEST_SESSION_MODE_COOKIE, 'persistent', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });
};
