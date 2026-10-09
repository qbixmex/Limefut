import type { FC } from 'react';
import { redirect } from 'next/navigation';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { fetchMatchAction } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { fetchTournamentsForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import { fetchTeamsForMatchEditAction } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-edit.action';
import type { TEAM_TYPE } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-edit.action';
import { fetchFieldsAction } from '@/app/admin/encuentros/(actions)/fetch-fields.action';
import { fetchCategoriesForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';
import type { CATEGORY_TYPE } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';
import { ROUTES } from '@/shared/constants/routes';
import { EditMatchForm } from './edit-match-form';
import { MATCH_STATUS } from '@/shared/enums';
import { PenaltyShoots } from '@/shared/components/penalty-shoots';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const EditMatchContent: FC<Props> = async ({ params, searchParams }) => {
  const matchId = (await params).id;
  const {
    tournament: tournamentParam,
    category: categoryParam,
  } = await searchParams;

  const responseMatch = await fetchMatchAction(matchId);

  if (!responseMatch.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(responseMatch.message)}`);
  }

  const match = responseMatch.match as MATCH_TYPE;

  const tournamentPermalink = tournamentParam ?? match.tournament.permalink;
  // When the tournament is explicitly present in the URL the user has made a
  // selection, so only trust the category in the URL (it's cleared on change).
  const categoryPermalink = tournamentParam
    ? categoryParam
    : (categoryParam ?? match.category?.permalink);

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

  const categoriesResponse = await fetchCategoriesForMatchAction(tournamentPermalink);

  if (!categoriesResponse.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(categoriesResponse.message)}`);
  }

  const categories: CATEGORY_TYPE[] = categoriesResponse.categories;

  let teams: TEAM_TYPE[] = [];

  if (tournamentPermalink && categoryPermalink) {
    const responseTeams = await fetchTeamsForMatchEditAction({
      tournamentPermalink,
      categoryPermalink,
    });

    if (!responseTeams.ok) {
      redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(responseTeams.message)}`);
    }

    teams = responseTeams.teams;
  }

  const fieldsResponse = await fetchFieldsAction();

  if (!fieldsResponse.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(fieldsResponse.message)}`);
  }

  return (
    <>
      <section>
        <EditMatchForm
          key={`${responseMatch.match?.tournament.id ?? 'tournament'}`}
          tournaments={tournamentsResponse.tournaments}
          categories={categories}
          teams={teams}
          fields={fieldsResponse.fields}
          match={responseMatch.match as MATCH_TYPE}
        />
      </section>

      {
        (match.status === MATCH_STATUS.COMPLETED) &&
        (match.localScore === match.visitorScore) && (
          <>
            <div className="w-full h-0.25 bg-gray-300 dark:bg-gray-700 my-8" />
            <PenaltyShoots
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
        )
      }
    </>
  );
};
