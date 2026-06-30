import type { FC } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { fetchMatchAction } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { fetchTournamentsForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import { fetchTeamsForMatchEditAction } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-edit.action';
import { fetchCategoriesForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants/routes';
import { EditMatchForm } from './edit-match-form';
import { MATCH_STATUS } from '@/shared/enums';
import { PenaltyShoots } from '@/shared/components/penalty-shoots';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditMatchContent: FC<Props> = async ({ params }) => {
  const matchId = (await params).id;
  const session = await auth.api.getSession({ headers: await headers() });

  const responseMatch = await fetchMatchAction(matchId, session?.user.roles ?? null);

  if (!responseMatch.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(responseMatch.message)}`);
  }

  const match = responseMatch.match as MATCH_TYPE;

  const usedShooterIds = match.penaltyShootout?.kicks
    ?.map(kick => kick.playerId) ?? [];

  const availableLocalPlayers = match.localTeam.players
    ?.filter(({ id }) => !usedShooterIds.includes(id))
    .map(({ id, name }) => ({ id, name })) ?? [];

  const availableVisitorPlayers = match.visitorTeam.players
    ?.filter(({ id }) => !usedShooterIds.includes(id))
    .map(({ id, name }) => ({ id, name })) ?? [];

  const tournamentsResponse = await fetchTournamentsForMatchAction();

  if (!tournamentsResponse.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(tournamentsResponse.message)}`);
  }

  const categoriesResponse = await fetchCategoriesForMatchAction();

  if (!categoriesResponse.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(categoriesResponse.message)}`);
  }

  const responseTeams = await fetchTeamsForMatchEditAction(responseMatch.match?.tournament.id as string);

  if (!responseTeams.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(responseTeams.message)}`);
  }

  return (
    <>
      <section>
        <EditMatchForm
          key={`${responseMatch.match?.tournament.id ?? 'tournament'}`}
          tournaments={tournamentsResponse.tournaments}
          categories={categoriesResponse.categories}
          teams={responseTeams.teams}
          authenticatedUserId={session?.user.id}
          authenticatedUserRoles={session?.user.roles}
          match={responseMatch.match as MATCH_TYPE}
        />
      </section>

      {
        (match.status === MATCH_STATUS.COMPLETED) &&
        (match.localScore === match.visitorScore) && (
          <>
            <div className="w-full h-0.25 bg-gray-300 dark:bg-gray-700 my-8" />
            <PenaltyShoots
              userRoles={session?.user.roles}
              match={{
                id: match.id,
                status: match.status,
                localScore: match.localScore,
                visitorScore: match.visitorScore,
              }}
              localTeam={{
                id: match.localTeam.id,
                name: match.localTeam.name,
              }}
              visitorTeam={{
                id: match.visitorTeam.id,
                name: match.visitorTeam.name,
              }}
              penaltyShootout={match.penaltyShootout}
              availablePlayers={{
                localPlayers: availableLocalPlayers,
                visitorPlayers: availableVisitorPlayers,
              }}
              phase="regular"
            />
          </>
        )}
    </>
  );
};
