import { Suspense, type FC } from 'react';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from '@/shared/components/search';
import { CreatePage } from './(components)/create-page';
import { CustomPagesView } from './(components)/custom-pages.view';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const EditCustomPage: FC<Props> = ({ searchParams }) => {
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
                Páginas
              </CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar página ..." />
                <CreatePage />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense>
                <CustomPagesView searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditCustomPage;
