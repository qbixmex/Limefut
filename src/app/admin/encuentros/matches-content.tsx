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
    sortMatchDate?: 'asc' | 'desc';
    sortWeek?: 'asc' | 'desc';
    torneo?: string;
    categoria?: string;
    status?: MATCH_STATUS_TYPE;
  }>;
}>;

export const MatchesContent: FC<Props> = async ({ searchParams }) => {
  const {
    torneo: tournamentPermalink,
    categoria: categoryPermalink,
    query,
    page: currentPage,
    sortWeek = 'asc',
    status,
    sortMatchDate = 'asc',
  } = await searchParams;

  if (!tournamentPermalink || !categoryPermalink) {
    return null;
  }

  const { ok, message, tournamentId } = await fetchTournamentByPermalinkAndCategory({
    permalink: tournamentPermalink,
    category: categoryPermalink,
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
