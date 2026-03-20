import type { FC } from 'react';
import { SignInOut } from './sign-in-out';
import type { SessionUI } from '@/shared/types';

type Props = Readonly<{ session: SessionUI }>;

export const AuthSession: FC<Props> = ({ session }) => {
  return (
    <SignInOut session={session} />
  );
};
