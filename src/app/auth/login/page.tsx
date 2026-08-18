import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from './components/login-form';
import { LoginSkeleton } from './components/login-skeleton';
import { getSession } from '@/lib/get-session';
import { fetchPublicGlobalSettingsAction } from '@/app/admin/ajustes-globales/(actions)/fetchPublicGlobalSettingsAction';
import styles from './styles.module.css';
import { ROUTES } from '@/shared/constants/routes';
import Image from 'next/image';

export const Login = () => {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
};

export const LoginContent = async () => {
  const session = await getSession();
  const { globalSettings } = await fetchPublicGlobalSettingsAction();

  if (session) {
    redirect(ROUTES.ADMIN_DASHBOARD);
  }

  return (
    <section className={styles.wrapper}>
      <Card className="w-full max-w-md mx-auto p-10">
        <CardHeader>
          {
            globalSettings?.logoUrl && (
              <a href="/" title="Volver a inicio">
                <Image
                  width={0}
                  height={0}
                  src={globalSettings?.logoUrl}
                  alt={`Logotipo de ${globalSettings?.siteName}`}
                  className={styles.logo}
                  loading="eager"
                />
              </a>
            )
          }
          <CardTitle className="text-center text-xl">
            <span aria-label="Accede con tus claves de acceso">
              Accede con tus claves de acceso
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
