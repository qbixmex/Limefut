'use server';

import { signOut } from "@/auth";

export const logoutAction = async () => {
  const cookieStore = await cookies();

  cookieStore.delete('next-auth.session-token');
  cookieStore.delete('next-auth.csrf-token');
  cookieStore.delete('next-auth.callback-url');
  cookieStore.delete('__Secure-next-auth.session-token');
  cookieStore.delete('__Secure-next-auth.csrf-token');

  await signOut({ redirectTo: '/login' });
};
