import type { FC } from 'react';
import { fetchResultsAction } from '../(actions)/fetchResultsAction';
import { redirect } from 'next/navigation';
import { RoleTypeSelector } from '../../components/roles';
import { RolesMatches } from './roles-matches';
import type { TeamType } from '../(actions)/fetchTeamsByTournamentAction';
import { TeamsSelector } from './teams-selector';
import { EmptyMatches } from './empty-matches';

type Props = Readonly<{
  teams: TeamType[];
  tournament?: string;
  category?: string;
  format?: string;
  roles?: 'complete' | 'team' | 'field';
  teamPermalink?: string;
}>;

export const ResultsList: FC<Props> = async ({
  tournament,
  category,
  format,
  roles,
  teams,
  teamPermalink,
}) => {
  if (!tournament || !category || !format) {
    redirect(`/resultados?error=${encodeURIComponent('¡ El torneo, categoría y formato son obligatorios !')}`);
  }

  const { ok, message, matches } = await fetchResultsAction(tournament, category, format, roles, teamPermalink);

  if (!ok) {
    redirect(`/resultados?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="mt-5">
      <RoleTypeSelector />

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
