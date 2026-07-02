import { Suspense, type FC } from 'react';
import { TeamsSelectorSkeleton } from './teams-selector-skeleton';
import { fetchTeamsForPlayer } from '../(actions)/fetchTeamsForPlayer';
import { TeamsSelector } from './teams-selector';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    team?: string;
    query?: string;
    page?: string;
  }>;
}>;

export const TeamsContent: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).tournament;
  const categoryPermalink = (await searchParams).category;

  if (!tournamentPermalink || !categoryPermalink) {
    return null;
  }

  return (
    <Suspense fallback={<TeamsSelectorSkeleton />}>
      <TeamsWrapper
        tournamentPermalink={tournamentPermalink}
        categoryPermalink={categoryPermalink}
      />
    </Suspense>
  );
};

type TeamsProps = Readonly<{
  tournamentPermalink: string;
  categoryPermalink: string;
}>;

const TeamsWrapper: FC<TeamsProps> = async ({ tournamentPermalink, categoryPermalink }) => {
  const { teams } = await fetchTeamsForPlayer({
    tournamentPermalink,
    categoryPermalink,
  });

  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px]">
      <TeamsSelector teams={teams} />
    </section>
  );
};
