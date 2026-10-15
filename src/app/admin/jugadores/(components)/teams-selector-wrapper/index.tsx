import type { FC } from 'react';
import { TeamsSelector } from '../teams-selector';
import { fetchTeamsForPlayer } from '../../(actions)/fetchTeamsForPlayer';

type Props = Readonly<{
  tournamentPermalink: string;
}>;

export const TeamsSelectorWrapper: FC<Props> = async (props) => {
  const { tournamentPermalink } = props;
  const { teams } = await fetchTeamsForPlayer(tournamentPermalink);

  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px]">
      <TeamsSelector teams={teams} />
    </section>
  );
};
