import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateAnnouncementForm } from './create-announcement.form';

const CreateAnnouncementPage: FC = async () => {
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
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAnnouncementPage;
