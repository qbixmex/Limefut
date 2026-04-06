import { headers } from 'next/headers';
import type { Session } from '@/lib/auth-client';
import { SignInOut } from './sign-in-out';
import { auth } from '@/lib/auth';

export const AuthSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <SignInOut session={session as Session} />
  );
};
