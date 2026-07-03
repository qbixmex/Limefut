import { Suspense, type FC } from 'react';
import { TeamsSkeleton } from './TeamsSkeleton';
import { TeamsList } from './TeamsList';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const TeamsContent: FC<Props> = async ({ searchParams }) => {
  const params = await searchParams;

  return (
    <Suspense
      key={
        `${params.tournament ?? 'tournament'}` +
        `-${params.category ?? 'category'}`
      }
      fallback={<TeamsSkeleton />}
    >
      <TeamsList
        tournamentPermalink={params.tournament}
        category={params.category}
      />
    </Suspense>
  );
};
