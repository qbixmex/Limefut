import { Suspense } from 'react';

import { LoginCard } from './components/login-card';
import { LoginSkeleton } from './components/login-skeleton';

export const Login = () => {
  return (
    <>
      <Suspense fallback={<LoginSkeleton />}>
        <LoginCard />
      </Suspense>
    </>
  );
};

export default Login;
