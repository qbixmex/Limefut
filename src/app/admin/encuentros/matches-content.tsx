import { Suspense, type FC } from 'react';
import { MatchesTableSkeleton } from './(components)/matches-table-skeleton';
import { MatchesWrapper } from './(components)/matches.wrapper';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import { fetchAdminTournamentAction } from '@/shared/actions/fetch-admin-tournament.action';
import { fetchAdminCategoryAction } from '@/shared/actions/fetch-admin-category.action';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
    tournament?: string;
    category?: string;
    'sort-match-date'?: 'asc' | 'desc';
    'sort-week'?: 'asc' | 'desc';
    status?: MATCH_STATUS_TYPE;
  }>;
}>;

export const MatchesContent: FC<Props> = async ({ searchParams }) => {
  const {
    tournament: tournamentPermalink,
    category: categoryPermalink,
    query,
    page: currentPage,
    'sort-week': sortWeek = 'asc',
    'sort-match-date': sortMatchDate = 'asc',
    status,
  } = await searchParams;

  if (!tournamentPermalink || !categoryPermalink) {
    return null;
  }

  const responseTournament = await fetchAdminTournamentAction(
    tournamentPermalink,
  );

  if (!responseTournament.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(responseTournament.message)}`);
  }

  const responseCategory = await fetchAdminCategoryAction(
    categoryPermalink,
  );

  if (!responseCategory.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(responseCategory.message)}`);
  }

  if (!responseTournament.tournament) return null;
  if (!responseCategory.category) return null;

  const tournament = responseTournament.tournament;
  const category = responseCategory.category;

  return (
    <section className="mt-10">
      <Suspense
        key={
          `${tournament.id ?? 'tournamentId'}` +
          `-${category.id ?? 'category'}` +
          `-${query ?? 'query'}` +
          `-${currentPage ?? 'page'}` +
          `-${sortWeek ?? 'sort-week'}`
        }
        fallback={<MatchesTableSkeleton colCount={6} rowCount={16} />}
      >
        <MatchesWrapper
          tournamentId={tournament.id}
          categoryId={category.id}
          query={query as string}
          currentPage={Number(currentPage as string)}
          sortMatchDate={sortMatchDate}
          sortWeek={sortWeek}
          status={status as MATCH_STATUS_TYPE}
        />
      </Suspense>
    </section>
  );
};
