import { Suspense, type FC } from 'react';
import { VideosView } from './(components)/videos-view';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from '@/shared/components/search';
import { CreateVideo } from './(components)/create-video';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const VideosPage: FC<Props> = ({ searchParams }) => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">
                Videos
              </CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar video" />
                <CreateVideo />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense>
                <VideosView searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default VideosPage;
