import { Suspense, type FC } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MatchForm } from '../(components)/match-form';
import { FormSkeleton } from '../(components)/form-skeleton';
import { ROUTES } from '@/shared/constants/routes';
import { fetchTournamentsForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import { fetchCategoriesForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';
import { fetchTeamsForMatchCreateAction, type TEAM_TYPE } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-create.action';

type MatchWrapperProps = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    ['selected-week']?: string;
  }>;
}>;

export const MatchWrapper: FC<MatchWrapperProps> = async ({ searchParams }) => {
  const {
    tournament: tournamentPermalink,
    category: categoryPermalink,
    'selected-week': selectedWeek,
  } = await searchParams;

  let tournament_category: string = 'tournament-category';

  if (tournamentPermalink && categoryPermalink) {
    tournament_category = `${tournamentPermalink}-${categoryPermalink}`;
  }

  return (
    <Suspense
      key={
        tournament_category +
        `${selectedWeek ?? 'selected-week'}`
      }
      fallback={<FormSkeleton />}
    >
      <CreateMatchContent
        tournamentPermalink={tournamentPermalink}
        categoryPermalink={categoryPermalink}
      />
    </Suspense>
  );
};

type CreateMatchContentProps = Readonly<{
  tournamentPermalink: string | undefined;
  categoryPermalink: string | undefined;
}>;

const CreateMatchContent: FC<CreateMatchContentProps> = async ({
  tournamentPermalink,
  categoryPermalink,
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!(session?.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear encuentros !';
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(message)}`);
  }

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
    <section className="mt-10">
      <MatchForm
        authenticatedUserId={session?.user.id}
        sessionUserRoles={session?.user.roles ?? []}
        tournaments={tournamentsResponse.tournaments}
        categories={categoriesResponse.categories}
        teams={teams}
      />
    </section>
  );
};
