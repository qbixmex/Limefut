import type { FC } from 'react';
import { Suspense } from 'react';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { MatchesWrapper } from './(components)/matches-wrapper';
import { MatchesTableSkeleton } from '@/app/admin/liguilla/(components)/matches-table-skeleton';
import { fetchPlayoffMatchesAction } from './(actions)/fetch-playoff-matches.action';

type Props = Readonly<{
  playoffIdPromise: Promise<string>;
  searchParams: Promise<{
    query?: string;
    page?: string;
    status?: MATCH_STATUS_TYPE;
    'sort-match-date'?: 'asc' | 'desc';
  }>;
}>;

export const PlayoffsMatchesContent: FC<Props> = async ({ playoffIdPromise, searchParams }) => {
  const playoffId = await playoffIdPromise;
  const {
    query,
    page: currentPage,
    'sort-match-date': sortMatchDate = 'asc',
    status,
  } = await searchParams;

  const { ok, message, matches } = await fetchPlayoffMatchesAction({
    playoffId,
    searchTerm: query,
    sortMatchDate,
    status,
    page: parseInt(currentPage ?? '0'),
    take: 12,
  });

  if (!ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS_MATCHES}?error=${encodeURIComponent(message)}`);
  }

  return (
    <section className="mt-10">
      <Suspense
        key={`${query ?? 'query'}-${currentPage ?? 'page'}`}
        fallback={<MatchesTableSkeleton />}
      >
        <MatchesWrapper playoffId={playoffId} matches={matches} />
      </Suspense>
    </section>
  );
};
