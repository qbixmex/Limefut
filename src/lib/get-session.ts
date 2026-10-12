'use server';

import { cache } from 'react';
import {
  checkNestTokenStatus,
  getNestAccessToken,
  mapNestRoles,
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

const toAuthSession = (user: NestAuthUser, token: string): AuthSession => ({
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
    token,
    createdAt: user.createdAt,
    expiresAt: null,
    userAgent: null,
  },
});

const getSessionPayload = cache(async (): Promise<AuthSession | null> => {
  const token = await getNestAccessToken();

  if (!token) {
    return null;
  }

  const check = await checkNestTokenStatus(token);

  if (!check.ok || check.user.isActive === false) {
    return null;
  }

  return toAuthSession(check.user, check.token);
});

export const getSession = cache(async (): Promise<AuthSession | null> => {
  return getSessionPayload();
});

export type RequireAdminResult =
  | { ok: true; session: AuthSession }
  | { ok: false; message: string };

export const requireAdmin = async (): Promise<RequireAdminResult> => {
  const session = await getSessionPayload();

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debes estar autentificado para realizar esta acción',
    };
  }

  if (!session.user.roles?.includes('admin')) {
    return {
      ok: false,
      message: 'No tienes permisos administrativos para realizar esta acción',
    };
  }

  return { ok: true, session };
};
