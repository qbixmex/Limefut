import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { CoachesTable } from './(components)/coaches-table';
import { CoachesTableSkeleton } from './(components)/coaches-table-skeleton';
import { Search } from '@/shared/components/search';
import { CreatePage } from './(components)/create-page';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const CoachesPageView: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query ?? '';
  const currentPage = (await searchParams).page ?? '1';

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Entrenadores</CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar entrenador ..." />
                <CreatePage />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense
                key={`${query ?? 'query'}-${currentPage}`}
                fallback={<CoachesTableSkeleton colCount={7} rowCount={6} />}
              >
                <CoachesTable
                  query={query}
                  currentPage={Number(currentPage)}
                />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
