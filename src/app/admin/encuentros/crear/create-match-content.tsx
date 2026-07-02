import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { CreateMatchForm } from '../(components)/create-match-form';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { fetchTournamentsForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import { fetchCategoriesForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';
import type { TEAM_TYPE } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-create.action';
import { fetchTeamsForMatchCreateAction } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-create.action';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    ['selected-week']?: string;
  }>;
}>;

export const MatchContent: FC<Props> = async ({ searchParams }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {
    tournament: tournamentPermalink,
    category: categoryPermalink,
  } = await searchParams;

  const tournamentsResponse = await fetchTournamentsForMatchAction();

  if (!tournamentsResponse.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(tournamentsResponse.message)}`);
  }

  const categoriesResponse = await fetchCategoriesForMatchAction();

  if (!categoriesResponse.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(categoriesResponse.message)}`);
  }

  let teams: TEAM_TYPE[] = [];

  if (tournamentPermalink && categoryPermalink) {
    const responseTeams = await fetchTeamsForMatchCreateAction({
      tournamentPermalink,
      categoryPermalink,
    });

    if (!responseTeams.ok) {
      redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(responseTeams.message)}`);
    }

    teams = responseTeams.teams;
  }

  return (
    <CreateMatchForm
      key={randomUUID()}
      tournaments={tournamentsResponse.tournaments}
      categories={categoriesResponse.categories}
      teams={teams}
      authenticatedUserId={session?.user.id}
      authenticatedUserRoles={session?.user.roles}
    />
  );
};
