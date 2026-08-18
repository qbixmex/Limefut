import { SignInOut } from './sign-in-out';
import { getSession } from '@/lib/get-session';

export const AuthSession = async () => {
  const session = await getSession();

  return (
    <SignInOut authenticatedUser={session?.user} />
  );
};
