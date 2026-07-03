import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { ClearFilters } from './(components)/clear-filters';
import { MatchesContent } from './matches-content';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { TournamentsSelectorSkeleton } from '../../(public)/components';
import { CreateMatch } from './(components)/create-match';
import { Search } from './(components)/search';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
    tournament?: string;
    category?: string;
    status?: MATCH_STATUS_TYPE;
    'sort-week'?: 'asc' | 'desc';
    'sort-match-date'?: 'asc' | 'desc';
  }>;
}>;

export const MatchesPage: FC<Props> = ({ searchParams }) => {
  const tournamentPromise = searchParams.then(sp => ({ tournament: sp.tournament }));

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Encuentros</CardTitle>
              <section className="flex gap-2.5">
                <Search placeholder="ejemplo: chivas vs atlas" />
                <ClearFilters />
                <CreateMatch />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TournamentsSelectorSkeleton />}>
                <SearchParamsSelectors tournamentPromise={tournamentPromise} />
              </Suspense>
              <Suspense>
                <MatchesContent searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MatchesPage;
