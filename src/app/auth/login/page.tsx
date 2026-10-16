import { Suspense } from 'react';
import { LoginSkeleton } from './components/login-skeleton';
import { LoginView } from './login-view';

const LoginPage = () => {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginView />
    </Suspense>
  );
};

export default LoginPage;
