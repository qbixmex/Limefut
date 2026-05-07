import type { FC } from 'react';
import { fetchResultsAction } from '../(actions)/fetchResultsAction';
import { redirect } from 'next/navigation';
import { RoleTypeSelector } from '../../components/roles';
import { RolesMatches } from './roles-matches';
import { TeamsSelector } from './teams-selector';
import { EmptyMatches } from './empty-matches';
import type { TeamType } from '../(actions)/fetchTeamsByTournamentAndCategoryAction';

type Props = Readonly<{
  teams: TeamType[];
  tournament: string;
  category: string;
  roles: 'complete' | 'team' | 'field';
  teamPermalink?: string;
}>;

export const ResultsList: FC<Props> = async ({
  tournament,
  category,
  roles,
  teams,
  teamPermalink,
}) => {
  const { ok, message, matches } = await fetchResultsAction({
    tournamentPermalink: tournament,
    categoryPermalink: category,
    roles,
    teamPermalink,
  });

  if (!ok) {
    redirect(`/resultados?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="mt-5">
      {tournament && category && (
        <RoleTypeSelector />
      )}

      {roles === 'team' && teams.length > 0 && (
        <TeamsSelector teams={teams} />
      )}

      { ((roles === 'team' && teamPermalink) || (roles === 'complete')) && matches.length > 0 && (
        <RolesMatches matches={matches} />
      )}

      { matches.length === 0 && <EmptyMatches /> }
    </div>
  );
};

export default ResultsList;
