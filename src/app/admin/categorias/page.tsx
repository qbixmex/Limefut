import { type FC, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
import { CreateCategory } from './(components)/create-category';
import { CategoriesView } from './categories-view';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const CategoriesPage: FC<Props> = ({ searchParams }) => {
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
                Categorías
              </CardTitle>
              <section className="flex gap-5 mt-3 lg:mt-0 items-center">
                <Search placeholder="Buscar categoría ..." />
                <CreateCategory />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense>
                <CategoriesView searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
