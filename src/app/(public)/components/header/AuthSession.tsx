import { headers } from 'next/headers';
import { SignInOut } from './sign-in-out';
import { auth } from '@/lib/auth';

export const AuthSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <SignInOut session={session} />
  );
};
