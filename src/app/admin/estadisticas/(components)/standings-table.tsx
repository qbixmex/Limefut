import type { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import type { StandingType } from '../(actions)/fetchStandingsAction';

type Props = Readonly<{
  standings: StandingType[];
}>;

export const StandingsTable: FC<Props> = ({ standings }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Posición</TableHead>
            <TableHead className="text-gray-400">Equipo</TableHead>
            <TableHead className="text-gray-400 text-center">JJ</TableHead>
            <TableHead className="text-gray-400 text-center">JG</TableHead>
            <TableHead className="text-gray-400 text-center">JE</TableHead>
            <TableHead className="text-gray-400 text-center">JP</TableHead>
            <TableHead className="text-gray-400 text-center">GF</TableHead>
            <TableHead className="text-gray-400 text-center">GC</TableHead>
            <TableHead className="text-gray-400 text-center">DIF</TableHead>
            <TableHead className="text-gray-400 text-center">PTS</TableHead>
            <TableHead className="text-gray-400 text-center">PTA</TableHead>
            <TableHead className="text-gray-400 text-center">PTT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing, index) => (
            <TableRow key={standing.team.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <Link
                  href={`/admin/equipos/${standing.team.id}`}
                  target="_blank"
                >
                  {standing.team.name}
                </Link>
              </TableCell>
              <TableCell className="text-blue-500 text-center">{standing.matchesPlayed}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.wins}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.draws}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.losses}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.goalsFor}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.goalsAgainst}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.goalsDifference}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.points}</TableCell>
              <TableCell className="text-blue-500 text-center">{standing.additionalPoints}</TableCell>
              <TableCell className="text-blue-500 text-center">
                {standing.points + standing.additionalPoints}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mt-10 text-gray-500">
        <div>
          <div className="flex gap-5">
            <span className="font-bold">JJ</span>
            <span className="italic">Juegos Jugados</span>
          </div>
          <div className="flex gap-5">
            <span className="font-bold">JG</span>
            <span className="italic">Juegos Ganados</span>
          </div>
        </div>
        <div>
          <div className="flex gap-5">
            <span className="font-bold">JG</span>
            <span className="italic">Juegos Empatados</span>
          </div>
          <div className="flex gap-5">
            <span className="font-bold">JP</span>
            <span className="italic">Juegos Perdidos</span>
          </div>
        </div>
        <div>
          <div className="flex gap-5">
            <span className="font-bold">GF</span>
            <span className="italic">Goles a Favor</span>
          </div>
          <div className="flex gap-5">
            <span className="font-bold">GC</span>
            <span className="italic">Goles en Contra</span>
          </div>
        </div>
        <div>
          <div className="flex gap-5">
            <span className="font-bold">DIF</span>
            <span className="italic">Diferencia de Goles</span>
          </div>
          <div className="flex gap-5">
            <span className="font-bold">PTS</span>
            <span className="italic">Puntos</span>
          </div>
        </div>
        <div>
          <div className="flex gap-5">
            <span className="font-bold">PTA</span>
            <span className="italic">Puntos Adicionales</span>
          </div>
          <div className="flex gap-5">
            <span className="font-bold">PTT</span>
            <span className="italic">Puntos Totales</span>
          </div>
        </div>
      </section>
    </>
  );
};
