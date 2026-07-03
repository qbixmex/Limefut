import { Suspense, type FC } from 'react';
import { StandingsTable } from './standings-table';
import { StandingsSkeleton } from './standings-skeleton';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const Standings: FC<Props> = async ({ searchParams }) => {
  const { tournament, category } = await searchParams;

  if (!tournament || !category) {
    return null;
  }

  return (
    <Suspense
      key={
        `${tournament ?? 'tournament'}` +
        `-${category ?? 'category'}`
      }
      fallback={<StandingsSkeleton />}
    >
      <StandingsTable
        tournamentPermalink={tournament}
        categoryPermalink={category}
      />
    </Suspense>
  );
};

export default Standings;
