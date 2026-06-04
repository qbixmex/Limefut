import type { FC } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { PlayoffsContent } from './matches-content';
import { ClearFilters } from './(components)/clear-filters';
import { CreateMatch } from './(components)/create-match';
import { TournamentsSelectorSkeleton } from '../../(public)/components';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
    tournament?: string;
    category?: string;
    status?: MATCH_STATUS_TYPE;
    'sort-match-date'?: 'asc' | 'desc';
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
              <CardTitle className="admin-page-card-title">Partidos de Liguilla</CardTitle>
              <section className="flex gap-2.5">
                <Search placeholder="ejemplo: chivas vs atlas" />
                <ClearFilters />
                <CreateMatch />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TournamentsSelectorSkeleton />}>
                <SearchParamsSelectors />
              </Suspense>
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
