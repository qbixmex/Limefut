import type { FC } from 'react';
import { LocalAndVisitorTeams } from '../local-and-visitor-teams';
import type { TEAM_TYPE } from '../../../(actions)/fetch-playoff-teams.action';
import { fetchPlayoffTeamsAction } from '../../../(actions)/fetch-playoff-teams.action';

type Props = Readonly<{
  playoffId: string | undefined;
}>;

export const TeamsSlot: FC<Props> = async ({
  playoffId,
}) => {
  let teams: TEAM_TYPE[] = [];

  if (playoffId) {
    const response = await fetchPlayoffTeamsAction({
      playoffId,
    });

    teams = response.teams;
  }

  return (
    <LocalAndVisitorTeams teams={teams} />
  );
};
