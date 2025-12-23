import { Suspense, type FC } from 'react';
import { MatchesTableSkeleton } from './(components)/matches-table-skeleton';
import { MatchesWrapper } from './(components)/matches.wrapper';
import type { MATCH_STATUS } from '~/src/shared/enums';

type MatchesContentProps = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
    sortMatchDate?: 'asc' | 'desc';
    sortWeek?: 'asc' | 'desc';
    torneo?: string;
    status?: MATCH_STATUS;
  }>;
}>;

export const MatchesContent: FC<MatchesContentProps> = async ({ searchParams }) => {
  const {
    torneo: tournamentId,
    query = '',
    page: currentPage = 1,
    sortMatchDate,
    sortWeek = 'desc',
    status,
  } = await searchParams;

  if (!tournamentId) return null;

  return (
    <section className="mt-10">
      <Suspense
        key={`${tournamentId}-${query}-${currentPage}`}
        fallback={<MatchesTableSkeleton colCount={6} rowCount={16} />}
      >
        <MatchesWrapper
          tournamentId={tournamentId}
          query={query}
          currentPage={+currentPage}
          sortMatchDate={sortMatchDate}
          sortWeek={sortWeek}
          status={status as MATCH_STATUS}
        />
      </Suspense>
    </section>
  );
};

export default MatchesContent;
