import { Suspense, type FC } from 'react';
import { ResultsSkeleton } from './results-skeleton';
import { ResultsList } from './results-list';
import { redirect } from 'next/navigation';
import type { TeamType } from '../(actions)/fetchTeamsByTournamentAction';
import { fetchTeamsByTournamentAction } from '../(actions)/fetchTeamsByTournamentAction';

type Props = Readonly<{
  searchParamsPromise: Promise<{
    torneo?: string;
    categoria?: string;
    formato?: string;
    roles?: 'complete' | 'team' | 'field';
    team?: string;
  }>;
}>;

export const ResultsContent: FC<Props> = async ({ searchParamsPromise }) => {
  const {
    torneo: tournament,
    categoria: category,
    formato: format,
    roles,
    team,
  } = await searchParamsPromise;

  if (!tournament && !category && !format) {
    return null;
  }

  let teams: TeamType[] = [];

  if (roles === 'team') {
    const teamsResponse = await fetchTeamsByTournamentAction(tournament!, category!, format!);

    if (!teamsResponse.ok) {
      redirect(`/resultados?error=${encodeURIComponent(teamsResponse.message)}`);
    }

    teams = teamsResponse.teams;
  }

  return (
    <Suspense
      key={
        `${tournament ?? 'tournament'}` +
        `-${category ?? 'category'}` +
        `-${format ?? 'format'}` +
        `-${roles ?? 'roles'}`
      }
      fallback={<ResultsSkeleton />}
    >
      <ResultsList
        tournament={tournament}
        category={category}
        format={format}
        roles={roles}
        teams={teams}
        teamPermalink={team}
      />
    </Suspense>
  );
};

export default ResultsContent;
