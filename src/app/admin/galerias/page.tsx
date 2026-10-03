import { Suspense, type FC } from 'react';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from '@/shared/components/search';
import { GalleriesView } from './(components)/galleries-view';
import { CreateGallery } from './(components)/create-gallery';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const GalleriesPage: FC<Props> = ({ searchParams }) => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Galerías</CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar galería ..." />
                <CreateGallery />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense>
                <GalleriesView searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default GalleriesPage;
