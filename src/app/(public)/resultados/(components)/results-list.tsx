import { Suspense, type FC } from 'react';
import { RoleTypeSelector } from '../../components/roles';
import { RolesMatches } from './roles-matches';
import { TeamsSelector } from './teams-selector';
import type { TeamType } from '../(actions)/fetchTeamsByTournamentAndCategoryAction';
import { ResultsSkeleton } from './results-skeleton';

type Props = Readonly<{
  tournament: string | undefined;
  category: string | undefined;
  teamPermalink: string | undefined;
  roles: 'complete' | 'team' | 'field' | undefined;
  teams: TeamType[];
}>;

export const ResultsList: FC<Props> = ({
  tournament,
  category,
  roles,
  teams,
  teamPermalink,
}) => {
  return (
    <div className="mt-5">
      {tournament && category && <RoleTypeSelector />}

      {(roles === 'team') && (teams.length > 0) && (
        <TeamsSelector teams={teams} />
      )}

      <Suspense fallback={<ResultsSkeleton />}>
        <RolesMatches
          tournamentPermalink={tournament}
          categoryPermalink={category}
          teamPermalink={teamPermalink}
          roles={roles}
        />
      </Suspense>
    </div>
  );
};
