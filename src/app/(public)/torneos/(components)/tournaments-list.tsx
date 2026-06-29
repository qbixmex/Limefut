'use client';

import { type FC } from 'react';
import type { TOURNAMENT_TYPE } from '../(actions)/fetchTournamentsAction';
import { Tournament } from './tournament';
import './styles.css';

type Props = Readonly<{
  tournaments: TOURNAMENT_TYPE[];
}>;

export const TournamentsList: FC<Props> = ({ tournaments }) => {
  return (
    <section className="tournaments">
      {tournaments.map((tournament) => (
        <Tournament
          key={tournament.id}
          tournament={tournament}
        />
      ))}
    </section>
  );
};
