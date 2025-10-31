'use client';

import { use, type FC } from 'react';
import type { StandingType, TournamentType, StandingPromise } from '../(actions)/fetchStandingsAction';
import { TournamentData, StandingsTable } from '.';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Team } from '@/shared/interfaces';

type Props = Readonly<{ standingsPromise: StandingPromise }>;

export const Standings: FC<Props> = ({ standingsPromise }) => {
  const response = use(standingsPromise);

  if (!response.ok) {
    toast.error(response.message);
    return null;
  }

  const tournament = response.tournament as TournamentType & {
    teams: Pick<Team, 'id' | 'name' | 'permalink'>[];
  };
  const standings = response.standings as StandingType[];

  return (
    <>
      <TournamentData tournament={tournament} />
      {
        (standings.length > 0) ? (
          <StandingsTable standings={standings} />
        ) : (
          (tournament.teams.length > 0) && (
          <div className="border border-blue-500 rounded-lg py-4 flex justify-center items-center gap-10">
            <p className="text-blue-500 font-bold text-center">
              ¡ El torneo aún no tiene tabla de Posiciones !
            </p>
            <Button variant="outline-primary">Crear</Button>
          </div>
        ))
      }
    </>
  );
};

export default Standings;
