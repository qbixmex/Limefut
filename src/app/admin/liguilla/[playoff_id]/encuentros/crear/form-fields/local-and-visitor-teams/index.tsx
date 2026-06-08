import type { FC } from 'react';
import { LocalTeamSelectField } from '../local-team-select-field';
import { VisitorTeamSelectField } from '../visitor-team-select-field';
import { type TEAM_TYPE } from '../../../../(actions)/fetch-playoff-teams.action';

type Props = Readonly<{ teams: TEAM_TYPE[] }>;

export const LocalAndVisitorTeams: FC<Props> = async ({ teams }) => {
  return (
    <section className="flex flex-column gap-5">
      <div className="w-full lg:w-1/2">
        <LocalTeamSelectField teams={teams} />
      </div>
      <div className="w-full lg:w-1/2">
        <VisitorTeamSelectField teams={teams} />
      </div>
    </section>
  );
};
