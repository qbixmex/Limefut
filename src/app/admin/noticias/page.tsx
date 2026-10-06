import type { FC } from 'react';
import { Suspense } from 'react';
import { AnnouncementsView } from './(components)/announcements-view';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from '@/shared/components/search';
import { CreateAnnouncement } from './(components)/create-announcement';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const AnnouncementsPage: FC<Props> = ({ searchParams }) => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title" role="heading" aria-level={1}>
                Noticias
              </CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar noticia" />
                <CreateAnnouncement />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense>
                <AnnouncementsView searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AnnouncementsPage;
