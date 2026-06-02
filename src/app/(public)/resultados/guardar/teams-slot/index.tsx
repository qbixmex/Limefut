import type { FC } from 'react';
import { LocalVisitorTeams } from '../local-visitor-teams';
import type { TEAM_TYPE } from '../../(actions)/fetchPublicTeamsAction';
import { fetchPublicTeamsAction } from '../../(actions)/fetchPublicTeamsAction';

type Props = Readonly<{ categoryPermalink: string | undefined }>;

export const TeamsSlot: FC<Props> = async ({ categoryPermalink }) => {
  let teams: TEAM_TYPE[] = [];

  if (categoryPermalink) {
    const response = await fetchPublicTeamsAction({ categoryPermalink });
    if (response.ok) {
      teams = response.teams;
    }
  }

  return (
    <LocalVisitorTeams
      teams={teams}
    />
  );
};
