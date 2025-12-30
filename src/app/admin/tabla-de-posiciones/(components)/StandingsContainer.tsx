import { type FC, Suspense } from 'react';
import { StandingsTable } from './standings-table';
import { SkeletonTable } from './SkeletonTable';

type Props = Readonly<{
  searchParams: Promise<{ torneo: string; }>;
}>;

export const StandingsContainer: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).torneo;

  return (
    <Suspense
      key={`permalink-${tournamentPermalink}`}
      fallback={<SkeletonTable />}
    >
      <StandingsTable permalink={tournamentPermalink} />
    </Suspense>
  );
};

export default StandingsContainer;
