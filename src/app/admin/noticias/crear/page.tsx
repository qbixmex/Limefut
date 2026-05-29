import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { headers } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { CreateAnnouncementForm } from './create-announcement.form';

const CreateAnnouncementPage: FC = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Noticia</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateAnnouncementForm
              key={randomUUID()}
              authenticatedUserId={session?.user.id}
              authenticatedUserRoles={session?.user.roles}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAnnouncementPage;
