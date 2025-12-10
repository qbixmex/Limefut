import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      if (isOnAdmin) {
        return isLoggedIn;
      } else if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl));
      } else {
        return true;
      }
    },
  },
  providers: [],
} satisfies NextAuthConfig;
