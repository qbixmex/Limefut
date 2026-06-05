import type { FC } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
// import { ClearFilters } from './(components)/clear-filters';
import { PlayoffsContent } from './playoffs-content';
// import { CreatePlayoff } from './(components)/create-playoff';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const PlayoffsPage: FC<Props> = ({ searchParams }) => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Liguilla</CardTitle>
              <section className="flex gap-2.5">
                <Search
                  placeholder="buscar por torneo ó categoría"
                  time={750}
                />
                {/* <ClearFilters /> */}
                {/* <CreateMatch /> */}
              </section>
            </CardHeader>
            <CardContent>
              <Suspense>
                <PlayoffsContent searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlayoffsPage;
