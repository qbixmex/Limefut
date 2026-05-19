import { Suspense, type FC } from 'react';
import { MatchesTableSkeleton } from './(components)/matches-table-skeleton';
import { MatchesWrapper } from './(components)/matches.wrapper';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { fetchTournamentByPermalinkAndCategory } from '@/shared/actions/fetchTournamentByPermalinkAndCategory';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';

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

  const { ok, message, tournamentId } = await fetchTournamentByPermalinkAndCategory({
    tournamentPermalink,
    categoryPermalink,
  });

  if (!ok && !tournamentId) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(message)}`);
  }

  if (!tournamentId) return null;

  return (
    <section className="mt-10">
      <Suspense
        key={
          `${tournamentId ?? 'tournamentId'}` +
          `-${categoryPermalink ?? 'category'}` +
          `-${query ?? 'query'}` +
          `-${currentPage ?? 'page'}` +
          `-${sortWeek ?? 'week'}`
        }
        fallback={<MatchesTableSkeleton colCount={6} rowCount={16} />}
      >
        <MatchesWrapper
          tournamentId={tournamentId}
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
