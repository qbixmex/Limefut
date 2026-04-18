import type { FC } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { SettingsForm } from './(components)/settings-form';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { Session } from '@/lib/auth-client';
import { fetchAdminGlobalSettingsAction } from './(actions)/fetchAdminGlobalSettingsAction';

const GlobalSettings: FC = () => <GlobalSettingsContent />;

const GlobalSettingsContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { globalSettings } = await fetchAdminGlobalSettingsAction(session?.user.roles ?? []);

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Ajustes Globales</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <ErrorHandler />
              <SettingsForm
                session={session as Session}
                globalSettings={globalSettings}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalSettings;
