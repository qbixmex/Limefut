'use client';

import { use, type FC } from 'react';
import type { StandingType, TournamentType, StandingPromise } from '../(actions)/fetchStandingsAction';
import { TournamentData, StandingsTable } from '.';
import { toast } from 'sonner';

type Props = Readonly<{ standingsPromise: StandingPromise }>;

export const Standings: FC<Props> = ({ standingsPromise }) => {
  const response = use(standingsPromise);

  if (!response.ok) {
    toast.error(response.message);
    return null;
  }

  const tournament = response.tournament as TournamentType;
  const standings = response.standings as StandingType[];

  return (
    <>
      <TournamentData tournament={tournament} />
      {
        (standings.length > 0) ? (
          <StandingsTable standings={standings} />
        ) : (
          <div className="border border-blue-500 rounded-lg py-4">
            <p className="text-blue-500 font-bold text-center">
              ¡ El torneo aún no tiene Tabla de Posiciones !
            </p>
          </div>
        )
      }
    </>
  );
};

export default Standings;
