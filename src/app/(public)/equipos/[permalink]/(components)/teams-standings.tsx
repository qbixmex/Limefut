import type { FC } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Table2 } from 'lucide-react';
import { type STANDINGS_TYPE, fetchTeamStandingsAction } from '../../(actions)/fetchTeamStandingsAction';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  teamId: string;
  tournamentId: string;
  tournamentPermalink: string;
  categoryPermalink: string;
  categoryId: string;
}>;

export const TeamStandings: FC<Props> = async ({
  teamId,
  tournamentId,
  tournamentPermalink,
  categoryPermalink,
  categoryId,
}) => {
  const response = await fetchTeamStandingsAction({
    teamId,
    tournamentId,
    categoryId,
  });

  if (!response.ok && !response.standings) return null;

  const standings = response.standings as STANDINGS_TYPE;

  return (
    <section>
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-3">Estadísticas</h2>

        <Tooltip>
          <TooltipTrigger>
            <Link
              href={
                ROUTES.PUBLIC_STANDINGS +
                `?tournament=${tournamentPermalink}` +
                `&category=${categoryPermalink}`
              }
              target="_blank"
              className={buttonVariants({
                variant: 'outline-info',
                size: 'icon',
              })} rel="noreferrer"
            >
              <Table2 />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="left">
            Ver tabla de posiciones
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col md:flex-row md:gap-5">
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
      </div>
    </section>
  );
};
