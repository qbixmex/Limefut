'use client';

import { type FC } from 'react';
import type { TournamentType } from '../(actions)/fetchTournamentsAction';
import { Tournament } from './tournament';
import "./styles.css";

type Props = Readonly<{
  tournaments: TournamentType[];
}>;

export const TournamentsList: FC<Props> = ({ tournaments }) => {
  return (
    <div className="tournaments">
      {tournaments.map((tournament) => (
        <div key={tournament.id}>
          <Tournament
            key={tournament.id}
            tournament={tournament}
          />
        </div>
      ))}
    </div>
  );
};

export default TournamentsList;
