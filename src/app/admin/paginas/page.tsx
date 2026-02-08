import { Suspense, type FC } from 'react';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Search from '@/shared/components/search';
import { PagesTableSkeleton } from './(components)/pages-table-skeleton';
import { PagesTable } from './(components)/pages-table';
import { CreatePage } from './(components)/create-page';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const CustomPagesPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <CustomPagesContent searchParams={searchParams} />
    </Suspense>
  );
};

const CustomPagesContent: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query;
  const currentPage = (await searchParams).page;

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Lista de Páginas</CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar página ..." />
                <CreatePage />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense
                key={`${query}-${currentPage}`}
                fallback={<PagesTableSkeleton />}
              >
                <PagesTable query={query} currentPage={currentPage} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CustomPagesPage;
