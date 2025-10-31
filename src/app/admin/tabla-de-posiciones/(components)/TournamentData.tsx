import { FC } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import type { TournamentType } from "../(actions)/fetchStandingsAction";
import type { Team } from "@/shared/interfaces";
import { Badge } from "@/root/src/components/ui/badge";
import Link from "next/link";

type Props = Readonly<{
  tournament: TournamentType & { teams: Pick<Team, 'id' | 'name' | 'permalink'>[] };
  standings: boolean;
}>;

export const TournamentData: FC<Props> = ({ tournament, standings = false }) => {
  return (
    <>
      <section className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-1/2">
          <Table className="w-full mb-10">
            <TableBody>
              <TableRow>
                <TableHead className="text-gray-400">Torneo</TableHead>
                <TableCell className="text-gray-500">{tournament?.name}</TableCell>
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
                <TableCell className="text-gray-500">{tournament?.city}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="w-full lg:w-1/2">
          <Table className="w-full mb-10">
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
      <section className="mb-10">
        {tournament.teams.length === 0 && (
          <div className="border-2 w-full border-amber-700 py-4 text-center rounded-lg">
            <p className="text-amber-700 text-xl italic">Este torneo aún no tiene equipos asignados</p>
          </div>
        )}
        {!standings && (
          <>
            <h2 className="text-lg mb-5">Equipos Asignados</h2>
            <div className="flex flex-wrap gap-3">
              {tournament.teams.map(({ id, name, permalink }) => (
                <Link key={id} href={`/admin/equipos/${permalink}`} target="_blank">
                  <Badge variant="outline-info">{name}</Badge>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
};
