import type { FC } from 'react';
import { CreateMatchForm } from '../(components)/create-match-form';
import { fetchTournamentsForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import { fetchCategoriesForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';
import type { TEAM_TYPE } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-create.action';
import { fetchTeamsForMatchCreateAction } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-create.action';
import { fetchFieldsAction } from '@/app/admin/encuentros/(actions)/fetch-fields.action';
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

  const fieldsResponse = await fetchFieldsAction();

  if (!fieldsResponse.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(fieldsResponse.message)}`);
  }

  return (
    <CreateMatchForm
      tournaments={tournamentsResponse.tournaments}
      categories={categoriesResponse.categories}
      teams={teams}
      fields={fieldsResponse.fields}
    />
  );
};
