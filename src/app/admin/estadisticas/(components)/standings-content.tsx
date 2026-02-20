import type { FC } from 'react';

import { CreateStandings } from './create-standings';
import { TournamentData } from '@/shared/components/TournamentData';
import { fetchStandingsAction, type TournamentType } from "../(actions)/fetchStandingsAction";
import { StandingsTable } from './standings-table';
import { UpdateStandings } from './update-standings';
import { DeleteStandings } from './delete-standings';
import "./standingsTableStyles.css";

type Props = Readonly<{
  tournamentId: string;
}>;

export const StandingsContent: FC<Props> = async ({ tournamentId }) => {
  if (!tournamentId) return null;

  const { tournament, standings } = await fetchStandingsAction(tournamentId);

  return (
    <>
      <TournamentData
        tournament={tournament as TournamentType}
        standings={standings!.length > 0}
        admin
      />

      <section className="relative">
        {tournament && (tournament.teams.length > 0) && (standings!.length === 0) && (
          <>
            <div className="w-full h-0.5 my-10 bg-gray-800" />
            <div className="flex justify-center items-center gap-x-5 border-2 border-blue-500 py-5 rounded-lg">
              <p className="text-blue-500 text-xl italic font-semibold text-center">
                ¡ El torneo aún no tiene tabla de Posiciones !
              </p>
              <CreateStandings tournament={tournament as TournamentType} />
            </div>
          </>
        )}

        {standings!.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-medium mb-5">Estadísticas</h3>

              {standings && (
                <div className="flex items-center gap-5">
                  <UpdateStandings tournamentId={tournamentId} />
                  <DeleteStandings tournamentId={tournamentId} />
                </div>
              )}
            </div>

            {!standings && (
              <div className="text-blue-500 dark:text-sky-500 mobile-xl text-4xl min-h-[200px] flex justify-center items-center">
                Aún no existen estadísticas para el torneo actual
              </div>
            )}

            {(standings) && <StandingsTable standings={standings} />}
          </>
        )}
      </section>
    </>
  );
};
