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
import { TournamentType } from "../(actions)/fetchStandingsAction";

export const TournamentData: FC<{ tournament: TournamentType }> = ({ tournament }) => {
  return (
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
  );
};
