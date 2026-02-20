import { type FC, Suspense } from 'react';
import { StandingsContent } from './standings-content';
import { SkeletonTable } from './SkeletonTable';

type Props = Readonly<{
  searchParams: Promise<{ torneo: string; }>;
}>;

export const StandingsContainer: FC<Props> = async ({ searchParams }) => {
  const tournamentId = (await searchParams).torneo;

  return (
    <Suspense key={tournamentId} fallback={<SkeletonTable />}>
      <StandingsContent tournamentId={tournamentId} />
    </Suspense>
  );
};

export default StandingsContainer;
