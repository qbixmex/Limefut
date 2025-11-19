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

type Props = {
  standings: {
    matchesPlayed: number;
    wings: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalsDifference: number;
    points: number;
    team: {
      id: string;
      name: string;
      permalink: string;
    }
  }[];
};

export const StandingsTable: FC<Props> = ({ standings }) => {
  if (standings.length == 0) {
    return (
      <div className="border-2 border-blue-500 py-5 rounded-lg">
        <p className="text-blue-500 font-bold text-center">Aún no hay estadísticas para este torneo</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Equipo</TableHead>
            <TableHead className="text-gray-400 text-center">JJ</TableHead>
            <TableHead className="text-gray-400 text-center">JG</TableHead>
            <TableHead className="text-gray-400 text-center">JP</TableHead>
            <TableHead className="text-gray-400 text-center">GF</TableHead>
            <TableHead className="text-gray-400 text-center">GC</TableHead>
            <TableHead className="text-gray-400 text-center">Dif</TableHead>
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
    </div>
  );
};