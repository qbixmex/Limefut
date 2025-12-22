import { Suspense, type FC } from 'react';
import { MatchesTableSkeleton } from './(components)/matches-table-skeleton';
import { MatchesWrapper } from './(components)/matches.wrapper';

type MatchesContentProps = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
    sortMatchDate?: 'asc' | 'desc';
    sortWeek?: 'asc' | 'desc';
    torneo?: string;
  }>;
}>;

export const MatchesContent: FC<MatchesContentProps> = async ({ searchParams }) => {
  const tournamentId = (await searchParams).torneo;
  const query = (await searchParams).query || '';
  const currentPage = (await searchParams).page || 1;
  const sortMatchDate = (await searchParams).sortMatchDate;
  const sortWeek = (await searchParams).sortWeek ?? 'desc';

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
        />
      </Suspense>
    </section>
  );
};

export default MatchesContent;
