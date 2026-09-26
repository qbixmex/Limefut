import { redirect } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from './components/login-form';
import { getSession } from '@/lib/get-session';
import { fetchPublicGlobalSettingsAction } from '@/app/admin/ajustes-globales/(actions)/fetchPublicGlobalSettingsAction';
import { ROUTES } from '@/shared/constants/routes';
import styles from './styles.module.css';

export const LoginView = async () => {
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
          <LoginForm />
        </CardContent>
      </Card>
    </section>
  );
};
