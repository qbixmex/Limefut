import { Suspense, type FC } from 'react';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from '@/shared/components/search';
import { NewsTable } from './news-table';
// import { NewsTable } from '../news-table';
// import { CreateNew } from './create-new';
// import { NewsTableSkeleton } from './news-table-skeleton';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const NewsContent: FC<Props> = async ({ searchParams }) => {
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
                {/* <CreateNew /> */}
              </section>
            </CardHeader>
            <CardContent>
              <Suspense
                key={`${query ?? 'query'}-${currentPage ?? 'current-page'}`}
                // TODO: fallback={<NewsTableSkeleton />}
                fallback={<p>Loading ...</p>}
              >
                <NewsTable
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
