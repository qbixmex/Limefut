import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { type STANDINGS_TYPE, fetchTeamStandingsAction } from '../../(actions)/fetchTeamStandingsAction';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  teamId: string;
  tournamentId: string;
}>;

export const TeamStandings: FC<Props> = async ({ teamId, tournamentId }) => {
  const response = await fetchTeamStandingsAction({
    teamId,
    tournamentId,
  });

  if (!response.ok && !response.standings) {
    redirect(`${ROUTES.PUBLIC_TEAMS}?error=${encodeURIComponent(response.message)}`);
  }

  const standings = response.standings as STANDINGS_TYPE;

  return (
    <>
      {!standings && (
        <div className="w-fit px-5 py-2.5 border border-sky-500 rounded mb-5">
          <p className="text-sky-500 font-bold italic">
            Aún no hay estadísticas disponibles
          </p>
        </div>
      )}

      {standings && (
        <section className="flex flex-col md:flex-row md:gap-5">
          <div className="w-full md:w-1/2">
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead>Juegos Jugados</TableHead>
                  <TableCell>{standings.matchesPlayed}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Juegos Ganados</TableHead>
                  <TableCell>{standings.wins}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Juegos Empatados</TableHead>
                  <TableCell>{standings.draws}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Juegos Perdidos</TableHead>
                  <TableCell>{standings.losses}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Goles a Favor</TableHead>
                  <TableCell>{standings.goalsFor}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="w-full md:w-1/2">
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead>Goles en Contra</TableHead>
                  <TableCell>{standings.goalsAgainst}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Diferencia de Goles</TableHead>
                  <TableCell>{standings.goalsDifference}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Puntos</TableHead>
                  <TableCell>{standings.points}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Puntos Adicionales</TableHead>
                  <TableCell>{standings.additionalPoints}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Puntos Totales</TableHead>
                  <TableCell>{standings.totalPoints}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="w-full flex justify-end items-center mt-5 gap-5">
              <p className="text-lg font-semibold">Posición en la tabla</p>
              <Badge variant="outline-info" className="text-lg px-4">
                {standings.position}
              </Badge>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
