import type { FC } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { type TournamentType } from '~/src/app/(public)/estadisticas/(actions)/fetchStandingsAction';

type Props = Readonly<{
  tournament: TournamentType & {
    teams: {
      id: string;
      name: string;
      permalink: string;
    }[];
  };
  standings: boolean;
  admin?: boolean;
}>;

export const TournamentData: FC<Props> = ({ tournament, standings = false, admin = false }) => {
  return (
    <>
      <section className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-1/2">
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableHead className="text-gray-400">Torneo</TableHead>
                <TableCell>
                  <Link
                    href={
                      `/torneos/${tournament.permalink}`
                      + `?categoria=${tournament.category}`
                      + `&formato=${tournament.format}`
                    }
                    target="_blank"
                  >
                    {tournament?.name}
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="text-gray-400">País</TableHead>
                <TableCell className="text-gray-500">{tournament?.country}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="text-gray-400">Estado</TableHead>
                <TableCell className="text-gray-500">{tournament?.state}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="text-gray-400">Ciudad</TableHead>
                <TableCell>
                  <p className="text-gray-500 text-wrap">
                    {tournament?.city}
                  </p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="w-full lg:w-1/2">
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableHead className="text-gray-400">Temporada</TableHead>
                <TableCell className="text-gray-500">{tournament?.season}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="text-gray-400">Fecha de Inicio</TableHead>
                <TableCell className="text-gray-500">
                  {format(tournament?.startDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="text-gray-400">Fecha Final</TableHead>
                <TableCell className="text-gray-500">
                  {format(tournament?.endDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="text-gray-400">Semana Actual</TableHead>
                <TableCell className="text-gray-500">{tournament?.currentWeek}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {tournament.teams.length === 0 && (
        <div className="border-2 w-full border-blue-500 py-4 text-center rounded-lg my-10">
          <p className="text-blue-500 text-xl font-semibold italic">
            Este torneo aún no tiene equipos asignados
          </p>
        </div>
      )}

      {!standings && (tournament.teams.length > 0) && (
        <div className="mt-5 mb-10">
          <h2 className="text-lg mb-5">Equipos Asignados</h2>
          <div className="flex flex-wrap gap-3">
            {tournament.teams.map(({ id, name, permalink }) => (
              <Link
                key={id}
                href={`${admin ? '/admin' : ''}/equipos/${permalink}`}
                target="_blank"
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
