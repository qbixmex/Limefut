import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
import { TournamentsSelectorSkeleton } from '../equipos/(components)/TournamentsSelectorSkeleton';
import { CreatePlayerButton } from './(components)/create-player-button';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';
import { PlayersView } from './(components)/players-view';
import { TeamsContent } from './(components)/teams-content';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    team?: string;
    query?: string;
    page?: string;
  }>;
}>;

export const PlayersPage: FC<Props> = ({ searchParams }) => {
  const tournamentPromise = searchParams.then(sp => ({ tournament: sp.tournament }));

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Jugadores</CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar jugador" />
                <CreatePlayerButton />
              </section>
            </CardHeader>
            <CardContent>
              <div className="space-y-5 mb-10">
                <Suspense fallback={<TournamentsSelectorSkeleton />}>
                  <SearchParamsSelectors tournamentPromise={tournamentPromise} />
                </Suspense>
                <Suspense>
                  <TeamsContent searchParams={searchParams} />
                </Suspense>
              </div>
              <Suspense>
                <PlayersView searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlayersPage;
