import { Suspense, type FC } from 'react';
import { ResultsSkeleton } from './results-skeleton';
import { ResultsList } from './results-list';
import { redirect } from 'next/navigation';
import {
  fetchTeamsByTournamentAndCategoryAction,
} from '../(actions)/fetchTeamsByTournamentAndCategoryAction';

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    categoria?: string;
    formato?: string;
    roles?: 'complete' | 'team' | 'field';
    team?: string;
  }>;
}>;

export const ResultsContent: FC<Props> = async ({ searchParams }) => {
  const {
    torneo: tournament,
    categoria: category,
    roles,
    team,
  } = await searchParams;

  if (!tournament && !category && !roles) {
    return null;
  }

  const { ok, message, teams } = await fetchTeamsByTournamentAndCategoryAction({
    tournamentPermalink: tournament as string,
    categoryPermalink: category as string,
  });

  if (!ok && teams.length === 0) {
    redirect(`/resultados?error=${encodeURIComponent(message)}`);
  }

  return (
    <Suspense
      key={
        `${tournament ?? 'tournament'}` +
        `-${category ?? 'category'}` +
        `-${roles ?? 'roles'}`
      }
      fallback={<ResultsSkeleton />}
    >
      <ResultsList
        tournament={tournament as string}
        category={category as string}
        roles={roles!}
        teams={teams}
        teamPermalink={team}
      />
    </Suspense>
  );
};

export default ResultsContent;
