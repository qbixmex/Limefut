'use client';

import type { FC } from 'react';
import { use, useState } from 'react';
import type { StandingType, TournamentType, StandingPromise } from '../(actions)/fetchStandingsAction';
import { TournamentData, StandingsTable } from '.';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { Team } from '@/shared/interfaces';
import { createStandingsAction } from "../(actions)/createStandingsAction";
import { cn } from '@/root/src/lib/utils';
import { LoaderCircle } from 'lucide-react';

type Props = Readonly<{
  standingsPromise: StandingPromise;
  refetchStandings: (tournamentId: string) => void;
}>;

export const Standings: FC<Props> = ({ standingsPromise, refetchStandings }) => {
  const response = use(standingsPromise);
  const [ creatingStandings, setCreatingStandings ] = useState(false);

  if (!response.ok) {
    toast.error(response.message);
    return null;
  }

  const tournament = response.tournament as TournamentType & {
    teams: Pick<Team, 'id' | 'name' | 'permalink'>[];
  };
  const standings = response.standings as StandingType[];

  const handleOnCreateStandings = async () => {
    
    const data = tournament.teams.map((team) => ({
      tournamentId: tournament.id,
      teamId: team.id,
    }));
    
    try {
      setCreatingStandings(true);
      const response = await createStandingsAction(data);
      if (!response.ok) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        refetchStandings(tournament.id);
      }
    } catch(error) {
      toast.error((error as Error).message);
    } finally {
      setCreatingStandings(false);
    }
  };

  return (
    <>
      <TournamentData
        tournament={tournament}
        standings={standings.length > 0}
      />
      {
        (standings.length > 0) ? (
          <StandingsTable
            tournamentId={tournament.id}
            standings={standings}
            onDeletedStandings={refetchStandings}
          />
        ) : (
          (tournament.teams.length > 0) && (
            <div className="border border-blue-500 rounded-lg py-4 flex justify-center items-center gap-10">
              <p className="text-blue-500 font-bold text-center">
                ¡ El torneo aún no tiene tabla de Posiciones !
              </p>
              <Button
                variant={creatingStandings ? "outline-secondary" : "outline-primary"}
                onClick={handleOnCreateStandings}
                disabled={creatingStandings}
                className={cn({'cursor-not-allowed animate-pulse': creatingStandings})}
              >
                Crear
                { creatingStandings && <LoaderCircle className="animate-spin" /> }
              </Button>
            </div>
          ))
      }
    </>
  );
};

export default Standings;
