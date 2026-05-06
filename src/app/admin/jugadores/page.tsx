import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Search } from '@/shared/components/search';
import { TeamsSelectorSkeleton } from './(components)/teams-selector-skeleton';
import { PlayersContent } from './(components)/players-content';
import { TeamsSelector } from './(components)/teams-selector';
import { fetchTeamsAction } from '~/src/shared/actions/fetchTeamsAction';
import { TournamentsSelector } from '../(components)/tournaments-selector';
import { fetchTournamentsAction } from '~/src/shared/actions/fetchTournamentsAction';
import TournamentsSelectorSkeleton from '../equipos/(components)/TournamentsSelectorSkeleton';
import { CreatePlayerButton } from './(components)/create-player-button';
import { fetchTournamentByPermalinkAndCategory } from '@/shared/actions/fetchTournamentByPermalinkAndCategory';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    categoria?: string;
    equipo?: string;
    query?: string;
    page?: string;
  }>;
}>;

export const PlayersPage: FC<Props> = ({ searchParams }) => {
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
              <section className="mb-10">
                <Suspense fallback={<TournamentsSelectorSkeleton />}>
                  <SearchParamsSelector />
                </Suspense>
                <TeamsContent searchParams={searchParams} />
              </section>
              <Suspense>
                <PlayersContent searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const SearchParamsSelector = async () => {
  const { tournaments } = await fetchTournamentsAction();
  return (
    <TournamentsSelector tournaments={tournaments} />
  );
};

const TeamsContent: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).torneo;
  const categoryPermalink = (await searchParams).categoria;

  if (!tournamentPermalink || !categoryPermalink) {
    return null;
  }

  const { ok, message, tournamentId } = await fetchTournamentByPermalinkAndCategory({
    permalink: tournamentPermalink,
    category: categoryPermalink,
  });

  if (!ok && !tournamentId) {
    redirect(`${ROUTES.ADMIN_PLAYERS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <Suspense fallback={<TeamsSelectorSkeleton />}>
      <TeamsWrapper tournamentId={tournamentId as string} />
    </Suspense>
  );
};

const TeamsWrapper: FC<{ tournamentId: string }> = async ({ tournamentId }) => {
  const { teams } = await fetchTeamsAction(tournamentId as string);

  return (
    <TeamsSelector teams={teams} />
  );
};

export default PlayersPage;
