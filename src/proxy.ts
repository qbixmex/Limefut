import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  checkNestTokenStatus,
  NEST_ACCESS_TOKEN_COOKIE,
  NEST_SESSION_MODE_COOKIE,
} from '@/lib/nest-api';
import { ROUTES } from '@/shared/constants/routes';

const isAdmin = (roles: string[] | undefined | null): boolean => {
  if (!Array.isArray(roles) || roles.length === 0) {
    return false;
  }

  return roles.some((role) => role.toLowerCase() === 'admin');
};

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(NEST_ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL(ROUTES.AUTH_LOGIN, request.url));
  }

  const check = await checkNestTokenStatus(token);

  if (!check.ok || check.user.isActive === false || !isAdmin(check.user.roles)) {
    return NextResponse.redirect(new URL(ROUTES.AUTH_LOGIN, request.url));
  }

  const response = NextResponse.next();

  const mode = request.cookies.get(NEST_SESSION_MODE_COOKIE)?.value;
  if (mode === 'persistent') {
    response.cookies.set(NEST_ACCESS_TOKEN_COOKIE, check.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });
    response.cookies.set(NEST_SESSION_MODE_COOKIE, 'persistent', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });
  }

  return response;
}

export const config = {
  matcher: '/admin/:path*',
};
