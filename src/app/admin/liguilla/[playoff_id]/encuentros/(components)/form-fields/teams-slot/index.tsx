import type { FC } from 'react';
import { LocalAndVisitorTeams } from '../local-and-visitor-teams';
import type { TEAM_TYPE } from '../../../(actions)/fetch-playoff-teams.action';
import { fetchPlayoffTeamsAction } from '../../../(actions)/fetch-playoff-teams.action';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  playoffId: string | undefined;
}>;

export const TeamsSlot: FC<Props> = async ({
  authenticatedUserId,
  authenticatedUserRoles,
  playoffId,
}) => {
  let teams: TEAM_TYPE[] = [];

  if (playoffId) {
    const response = await fetchPlayoffTeamsAction({
      authenticatedUserId,
      authenticatedUserRoles,
      playoffId,
    });

    teams = response.teams;
  }

  return (
    <LocalAndVisitorTeams teams={teams} />
  );
};
