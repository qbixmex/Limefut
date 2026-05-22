import type { FC } from 'react';
import { auth } from '@/lib/auth';
import { MatchForm } from '@/app/admin/encuentros/(components)/match-form';
import { fetchTournamentsForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import { fetchMatchAction } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { fetchTeamsForMatchEditAction } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-edit.action';
import { fetchCategoriesForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{ matchId: string }>;

export const EditMatchContent: FC<Props> = async ({ matchId }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  const responseMatch = await fetchMatchAction(matchId, session?.user.roles ?? null);

  if (!responseMatch.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(responseMatch.message)}`);
  }

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
    <MatchForm
      authenticatedUserId={session?.user.id}
      sessionUserRoles={session?.user.roles ?? []}
      match={responseMatch.match}
      teams={responseTeams.teams}
      tournaments={tournamentsResponse.tournaments}
      categories={categoriesResponse.categories}
    />
  );
};
