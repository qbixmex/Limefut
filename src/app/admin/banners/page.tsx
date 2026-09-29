import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
import { BannersView } from './(components)/banners-view';
import { CreateBanner } from './(components)/create-banner';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const BannersPage: FC<Props> = ({ searchParams }) => {
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
                Banners
              </CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar banner ..." />
                <CreateBanner />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense>
                <BannersView searchParamsPromise={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BannersPage;
