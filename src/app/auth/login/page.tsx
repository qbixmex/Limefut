import { Suspense } from 'react';
import { LoginSkeleton } from './components/login-skeleton';
import { LoginView } from './login-view';

export const Login = () => {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginView />
    </Suspense>
  );
};

export default Login;
