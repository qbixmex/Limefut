import type { FC } from 'react';
import { TeamsFormSelect } from './teams-form-select';
import { fetchTeamsAction } from '../../../(actions)/fetch-teams.action';

type Props = Readonly<{
  tournamentPermalink: string | undefined;
  categoryPermalink: string | undefined;
}>;

type TEAM_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export const TeamsSelectField: FC<Props> = async ({
  tournamentPermalink,
  categoryPermalink,
}) => {
  let teams: TEAM_TYPE[] = [];

  if (tournamentPermalink && categoryPermalink) {
    const response = await fetchTeamsAction({
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
