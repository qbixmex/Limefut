import type { FC } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { TEAM_TYPE, TOURNAMENT_TYPE } from '@/app/admin/estadisticas/(actions)/fetchStandingsAction';
import { ROUTES } from '../constants/routes';

type Props = Readonly<{
  tournament: TOURNAMENT_TYPE;
  teams: TEAM_TYPE[];
  standings: boolean;
  admin?: boolean;
}>;

export const TournamentData: FC<Props> = ({
  tournament,
  teams,
  standings = false,
  admin = false,
}) => {
  return (
    <>
      <section className="flex flex-col lg:flex-row gap-5 mb-10">
        <div className="w-full lg:w-1/2">
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableHead className="text-gray-400 w-25">Torneo</TableHead>
                <TableCell>
                  <Link
                    href={`${ROUTES.PUBLIC_TOURNAMENTS}/${tournament.id}`}
                    target="_blank"
                    className="font-semibold italic" rel="noreferrer"
                  >
                    {tournament?.name}
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="text-gray-400 w-25">Fecha de Inicio</TableHead>
                <TableCell className="text-gray-500">
                  {format(tournament?.startDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="text-gray-400 w-25">Fecha Final</TableHead>
                <TableCell className="text-gray-500">
                  {format(tournament.endDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="w-full lg:w-1/2">
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableHead className="text-gray-400 w-25">País</TableHead>
                <TableCell className="text-gray-500">{tournament.country}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="text-gray-400 w-25">
                  Ciudad{(tournament.cities.length > 1) ? 'es' : '' }
                </TableHead>
                <TableCell>
                  <span className="text-gray-500 italic text-wrap">
                    {
                      (tournament.cities.length > 0)
                        ? tournament.cities.join(', ')
                        : 'no definida'
                    }
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="text-gray-400 w-25">Temporada</TableHead>
                <TableCell className="text-gray-500">{tournament?.season}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {teams.length === 0 && (
        <div className="border-2 w-full border-blue-500 py-4 text-center rounded-lg my-10">
          <p className="text-blue-500 text-xl font-semibold italic">
            Este torneo aún no tiene equipos asignados
          </p>
        </div>
      )}

      {!standings && (teams.length > 0) && (
        <div className="mt-5 mb-10">
          <h2 className="text-lg mb-5">Equipos Asignados</h2>
          <div className="flex flex-wrap gap-3">
            {teams.map(({ id, name, permalink }) => (
              <Link
                key={id}
                href={`${admin ? '/admin' : ''}/equipos/${permalink}`}
                target="_blank" rel="noreferrer"
              >
                <Badge variant="outline-info">{name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
