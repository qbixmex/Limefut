'use client';

import { type FC } from 'react';
import type { TournamentType } from '../(actions)/fetchTournamentsAction';
import { Tournament } from './tournament';
import "./styles.css";

type Props = Readonly<{
  tournaments: TournamentType[];
}>;

export const TournamentsList: FC<Props> = ({ tournaments }) => {
  const femaleTournaments = tournaments.filter(t => t.gender === 'female');
  const maleTournaments = tournaments.filter(t => t.gender === 'male');

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
        Rama Femenil
      </h2>

      <section className="tournaments">
        {femaleTournaments.map((tournament) => (
          <div key={tournament.id}>
            <Tournament
              key={tournament.id}
              tournament={tournament}
            />
          </div>
        ))}
      </section>

      <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
        Rama Varonil
      </h2>

      <section className="tournaments">
        {maleTournaments.map((tournament) => (
          <div key={tournament.id}>
            <Tournament
              key={tournament.id}
              tournament={tournament}
            />
          </div>
        ))}
      </section>
    </>
  );
};

export default TournamentsList;
