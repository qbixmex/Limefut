import { type FC, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoriesTable } from './(components)/categories-table';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
import { CategoriesTableSkeleton } from './(components)/categories-table.skeleton';
import { CreateCategory } from './(components)/create-category';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const CategoriesPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <CategoriesContent searchParams={searchParams} />
    </Suspense>
  );
};

const CategoriesContent: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query || '';
  const currentPage = (await searchParams).page || '1';

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Categorías</CardTitle>
              <section className="flex gap-5 mt-3 lg:mt-0 items-center">
                <Search placeholder="Buscar categoría ..." />
                <CreateCategory />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense
                key={`${query ?? 'query'}-${currentPage}`}
                fallback={<CategoriesTableSkeleton />}
              >
                <CategoriesTable query={query} currentPage={currentPage} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
