import type { FC } from 'react';
import { Suspense } from 'react';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { MatchesWrapper } from './(components)/matches-wrapper';
import { fetchTournamentByPermalinkAndCategory } from '@/shared/actions/fetchTournamentByPermalinkAndCategory';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
    tournament?: string;
    category?: string;
    status?: MATCH_STATUS_TYPE;
    'sort-match-date'?: 'asc' | 'desc';
  }>;
}>;

export const PlayoffsMatchesContent: FC<Props> = async ({ searchParams }) => {
  const {
    tournament: tournamentPermalink,
    category: categoryPermalink,
    query,
    page: currentPage,
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
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(message)}`);
  }

  if (!tournamentPermalink) return null;

  return (
    <section className="mt-10">
      <Suspense
        key={
          `${tournamentPermalink ?? 'tournamentPermalink'}` +
          `-${categoryPermalink ?? 'category'}` +
          `-${query ?? 'query'}` +
          `-${currentPage ?? 'page'}`
        }
        // TODO: fallback={<MatchesTableSkeleton />}
        fallback={<p>Cargando partidos</p>}
      >
        <MatchesWrapper
          tournamentPermalink={tournamentPermalink}
          categoryPermalink={categoryPermalink}
          query={query as string}
          currentPage={Number(currentPage as string)}
          sortMatchDate={sortMatchDate}
          status={status as MATCH_STATUS_TYPE}
        />
      </Suspense>
    </section>
  );
};
