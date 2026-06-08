import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';

export const EditPlayoffMatchPage: FC = () => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Editar Encuentro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Editar Partido</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditPlayoffMatchPage;
