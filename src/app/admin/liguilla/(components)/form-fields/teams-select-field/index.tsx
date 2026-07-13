import type { FC } from 'react';
import { TeamsFormSelect } from './teams-form-select';
import { fetchTeamsAction } from '../../../(actions)/fetch-teams.action';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  tournamentPermalink: string | undefined;
  categoryPermalink: string | undefined;
}>;

type TEAM_TYPE = {
  id: string;
  name: string;
  permalink: string;
}

export const TeamsSelectField: FC<Props> = async ({
  authenticatedUserId,
  authenticatedUserRoles,
  tournamentPermalink,
  categoryPermalink,
}) => {
  let teams: TEAM_TYPE[] = [];

  if (tournamentPermalink && categoryPermalink) {
    const response = await fetchTeamsAction({
      authenticatedUserId,
      authenticatedUserRoles,
      tournamentPermalink,
    });
    if (response.ok) {
      teams = response.teams;
    }
  }

  return (
    <TeamsFormSelect teams={teams} />
  );
};
