import { type FC, Suspense } from 'react';
import { StandingsTable } from './standings-table';
import { SkeletonTable } from './SkeletonTable';

type Props = Readonly<{
  searchParams: Promise<{ torneo: string; }>;
}>;

export const StandingsContainer: FC<Props> = async ({ searchParams }) => {
  const tournamentId = (await searchParams).torneo;

  return (
    <Suspense
      key={`tournamentId-${tournamentId}`}
      fallback={<SkeletonTable />}
    >
      <StandingsTable tournamentId={tournamentId} />
    </Suspense>
  );
};

export default StandingsContainer;
