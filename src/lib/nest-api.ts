import { cookies } from 'next/headers';
import { ROLE, type ROLE_TYPE } from '../shared/interfaces';

export const NEST_ACCESS_TOKEN_COOKIE = 'nest_access_token';
export const NEST_SESSION_MODE_COOKIE = 'nest_session_mode';

export type NestSessionMode = 'persistent' | 'session';

export const AUTH_LOGIN_ENDPOINT = '/auth/login';
export const NEST_CHECK_STATUS_ENDPOINT = '/auth/check-status';

const getNestBaseUrl = (): string => {
  return process.env.AUTH_API_BASE_URL ?? '';
};

export interface NestAuthUser {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  imageUrl: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}

interface NestAuthBody {
  statusCode?: number;
  message?: string;
  user?: NestAuthUser;
  token?: string;
}

export type LoginWithNestApiResult =
  | { ok: true; message: string; user: NestAuthUser; token: string }
  | { ok: false; message: string };

export const loginWithNestApi = async (
  email: string,
  password: string,
): Promise<LoginWithNestApiResult> => {
  try {
    const response = await fetch(`${getNestBaseUrl()}${AUTH_LOGIN_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    const body = await response.json().catch(() => null) as NestAuthBody | null;

    if (
      !response.ok ||
      body?.statusCode !== 200 ||
      !body?.user ||
      !body?.token
    ) {
      const message = body?.message ?? '¡ Credenciales Inválidas !';

      return {
        ok: false,
        message,
      };
    }

    return {
      ok: true,
      message: body.message ?? '¡ Has accedido correctamente 👍 !',
      user: body.user,
      token: body.token,
    };
  } catch (error) {
    console.error('NestJS login error:', error);
    return {
      ok: false,
      message: '¡ No se pudo conectar con el servicio de autentificación ❌ !',
    };
  }
};

export type CheckNestTokenStatusResult =
  | { ok: true; user: NestAuthUser; token: string }
  | { ok: false; message: string };

export const checkNestTokenStatus = async (
  token: string,
): Promise<CheckNestTokenStatusResult> => {
  try {
    const response = await fetch(
      `${getNestBaseUrl()}${NEST_CHECK_STATUS_ENDPOINT}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      },
    );

    const body = await response.json().catch(() => null) as NestAuthBody | null;

    if (
      !response.ok ||
      body?.statusCode !== 200 ||
      !body?.user ||
      !body?.token
    ) {
      return {
        ok: false,
        message:
          body?.message ??
          '¡ La sesión ha expirado, inicie sesión nuevamente !',
      };
    }

    return {
      ok: true,
      user: body.user,
      token: body.token,
    };
  } catch (error) {
    console.error('NestJS check-status error:', error);
    return {
      ok: false,
      message: '¡ No se pudo conectar con el servicio de autentificación ❌ !',
    };
  }
};

export const mapNestRoles = (
  roles: string[] | undefined | null,
): ROLE_TYPE[] => {
  const validRoles = new Set<string>([ROLE.ADMIN, ROLE.USER]);

  if (!Array.isArray(roles) || roles.length === 0) {
    return [ROLE.USER];
  }

  const normalized = Array.from(
    new Set(roles.map((role) => role.toLowerCase())),
  ).filter((role): role is ROLE_TYPE => validRoles.has(role));

  return normalized.length > 0 ? normalized : [ROLE.USER];
};

export const getNestAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(NEST_ACCESS_TOKEN_COOKIE)?.value ?? null;
};

export type NestApiResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
};

export const callNestApi = async <T>(
  path: string,
  init?: RequestInit,
  token?: string | null,
): Promise<NestApiResult<T>> => {
  const accessToken = token ?? (await getNestAccessToken());
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(`${getNestBaseUrl()}${path}`, {
      ...init,
      headers,
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null) as T | null;

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error(`NestJS API call error (${path}):`, error);
    return {
      ok: false,
      status: 0,
      data: null,
    };
  }
};
