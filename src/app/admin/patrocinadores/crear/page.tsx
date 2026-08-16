import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SponsorForm } from '../(components)/sponsor-form';

const CreateSponsorPage: FC = () => {
  return (
    <Suspense>
      <CreateSponsorContent />
    </Suspense>
  );
};

const CreateSponsorContent: FC = async () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Patrocinador</CardTitle>
          </CardHeader>
          <CardContent>
            <SponsorForm
              key={randomUUID()}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSponsorPage;
