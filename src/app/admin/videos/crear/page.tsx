import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { headers } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoForm } from '../(components)/video-form';
import type { Session } from '@/lib/auth-client';
import { auth } from '@/lib/auth';

const CreateVideoPage: FC = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Noticia</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoForm
              key={randomUUID()}
              session={session as Session}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateVideoPage;
