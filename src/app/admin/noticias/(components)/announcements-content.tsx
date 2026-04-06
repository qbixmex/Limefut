import { Suspense, type FC } from 'react';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from '@/shared/components/search';
import { AnnouncementsTable } from './announcements-table';
import { CreateAnnouncement } from './create-announcement';
import { AnnouncementsTableSkeleton } from './announcements-table-skeleton';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const AnnouncementsContent: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query;
  const currentPage = (await searchParams).page;

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">
                Noticias
              </CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar noticia" />
                <CreateAnnouncement />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense
                key={`${query ?? 'query'}-${currentPage ?? 'current-page'}`}
                fallback={<AnnouncementsTableSkeleton />}
              >
                <AnnouncementsTable
                  query={query}
                  currentPage={currentPage}
                />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
