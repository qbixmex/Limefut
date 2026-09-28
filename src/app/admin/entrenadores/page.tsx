import type { FC } from 'react';
import { Suspense } from 'react';
import { CoachesPageView } from './coaches-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
import { CreatePage } from './(components)/create-page';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const CoachesPage: FC<Props> = ({ searchParams }) => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle
                className="admin-page-card-title"
                role="heading"
                aria-label="Título de la página"
              >
                Entrenadores
              </CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar entrenador ..." />
                <CreatePage />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense>
                <CoachesPageView searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CoachesPage;
