import { type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { StandingType } from "../(actions)/fetchStandingsAction";

export const StandingsTable: FC<{ standings: StandingType[] }> = ({ standings }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Equipo</TableHead>
            <TableHead className="text-gray-400 text-center">Jugados</TableHead>
            <TableHead className="text-gray-400 text-center">Ganados</TableHead>
            <TableHead className="text-gray-400 text-center">Perdidos</TableHead>
            <TableHead className="text-gray-400 text-center">Goles a favor</TableHead>
            <TableHead className="text-gray-400 text-center">Goles en contra</TableHead>
            <TableHead className="text-gray-400 text-center">Diferencia</TableHead>
            <TableHead className="text-gray-400 text-center">Puntos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing) => (
            <TableRow key={standing.team.id}>
              <TableCell>
                <Link href={`/admin/equipos/${standing.team.permalink}`} target="_blank">
                  {standing.team.name}
                </Link>
              </TableCell>
              <TableCell className="text-blue-500 text-center">{standing.matchesPlayed}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.wings}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.losses}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.goalsFor}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.goalsAgainst}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.goalsDifference}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};