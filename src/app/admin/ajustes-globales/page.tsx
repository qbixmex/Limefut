import type { FC } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { SettingsForm } from './(components)/settings-form';
import { fetchAdminGlobalSettingsAction } from './(actions)/fetchAdminGlobalSettingsAction';

const GlobalSettings: FC = () => <GlobalSettingsContent />;

const GlobalSettingsContent = async () => {
  const { globalSettings } = await fetchAdminGlobalSettingsAction();

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
              <SettingsForm globalSettings={globalSettings} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalSettings;
