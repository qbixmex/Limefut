import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
import { ClearFilters } from '../../../encuentros/(components)/clear-filters';
import { CreateMatch } from '../../../encuentros/(components)/create-match';

export const EditPlayoffPage: FC = () => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Encuentros</CardTitle>
              <section className="flex gap-2.5">
                <Search placeholder="ejemplo: chivas vs atlas" />
                <ClearFilters />
                <CreateMatch />
              </section>
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

export default EditPlayoffPage;
