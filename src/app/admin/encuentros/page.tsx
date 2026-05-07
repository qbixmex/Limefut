import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import ClearFilters from './(components)/clear-filters';
import { fetchTournamentsForMatchAction } from './(actions)/fetchTournamentsForMatchAction';
import { TournamentsSelector } from '@/app/admin/(components)/tournaments-selector';
import { MatchesContent } from './matches-content';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { TournamentsSelectorSkeleton } from '../../(public)/components';
import { CreateMatch } from './(components)/create-match';
import { Search } from './(components)/search';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
    sortMatchDate?: 'asc' | 'desc';
    sortWeek?: 'asc' | 'desc';
    torneo?: string;
    categoria?: string;
    status?: MATCH_STATUS_TYPE;
  }>;
}>;

export const MatchesPage: FC<Props> = ({ searchParams }) => {
  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Encuentros</CardTitle>
              <section className="flex lg:w-1/2 justify-end gap-5 items-center">
                <ClearFilters />
                <Search placeholder="ejemplo: country vs tepeyac" />
                <CreateMatch />
              </section>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TournamentsSelectorSkeleton />}>
                <SearchParamsSelector />
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

const SearchParamsSelector = async () => {
  const { tournaments } = await fetchTournamentsForMatchAction();

  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px]">
      <TournamentsSelector tournaments={tournaments} />
    </section>
  );
};

export default MatchesPage;
