import { Suspense, type FC } from 'react';
import { TeamsSelectorSkeleton } from './teams-selector-skeleton';
import { TeamsSelectorWrapper } from './teams-selector-wrapper';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    team?: string;
    query?: string;
    page?: string;
  }>;
}>;

export const TeamsView: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).tournament;
  const categoryPermalink = (await searchParams).category;

  if (!tournamentPermalink || !categoryPermalink) {
    return null;
  }

  return (
    <Suspense fallback={<TeamsSelectorSkeleton />}>
      <TeamsSelectorWrapper
        tournamentPermalink={tournamentPermalink}
      />
    </Suspense>
  );
};
