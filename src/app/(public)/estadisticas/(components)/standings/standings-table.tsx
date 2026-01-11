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
import { fetchStandingsAction, type TournamentType } from '~/src/app/(public)/estadisticas/(actions)/fetchStandingsAction';
import { TournamentData } from "~/src/shared/components/TournamentData";
import { redirect } from "next/navigation";

type Props = {
  tournament?: string;
  category?: string;
  format?: string;
};

export const StandingsTable: FC<Props> = async ({
  tournament,
  category,
  format,
}) => {
  if (!tournament || !category || !format) {
    redirect(`/estadisticas?error=${encodeURIComponent('¡ El torneo, categoría y formato son obligatorios !')}`);
  }

  const response = await fetchStandingsAction(
    tournament,
    category,
    format,
  );

  if (!response.ok) {
    redirect(`/estadisticas?error=${encodeURIComponent(response.message)}`);
  }

  if (response.standings.length == 0) {
    return (
      <div className="border-2 border-blue-500 py-5 rounded-lg">
        <p className="text-blue-500 font-bold text-center">
          Aún no hay estadísticas para este torneo
        </p>
      </div>
    );
  }

  return (
    <>
      <TournamentData
        tournament={response.tournament as TournamentType}
        standings={response.standings.length > 0}
      />

      <div className="relative">
        <h2 className="text-xl font-semibold text-emerald-700 dark:text-gray-200 mb-5">
          Tabla de posiciones
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="dark:text-gray-400 text-center">Posición</TableHead>
              <TableHead className="dark:text-gray-400">Equipo</TableHead>
              <TableHead className="dark:text-gray-400 text-center">JJ</TableHead>
              <TableHead className="dark:text-gray-400 text-center">JG</TableHead>
              <TableHead className="dark:text-gray-400 text-center">JE</TableHead>
              <TableHead className="dark:text-gray-400 text-center">JP</TableHead>
              <TableHead className="dark:text-gray-400 text-center">GF</TableHead>
              <TableHead className="dark:text-gray-400 text-center">GC</TableHead>
              <TableHead className="dark:text-gray-400 text-center">DIF</TableHead>
              <TableHead className="dark:text-gray-400 text-center">PTS</TableHead>
              <TableHead className="dark:text-gray-400 text-center">PTA</TableHead>
              <TableHead className="dark:text-gray-400 text-center">PTT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {response.standings.map((standing, index) => (
              <TableRow key={standing.team.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  <Link
                    href={
                      `/equipos/${standing.team.permalink}`
                      + `?torneo=${response.tournament?.permalink}`
                      + `&categoria=${response.tournament?.category}`
                      + `&formato=${response.tournament?.format}`
                    }
                      target="_blank"
                    className="font-semibold italic"
                  >
                    {standing.team.name}
                  </Link>
                </TableCell>
                <TableCell className="text-blue-500 text-center">{standing.matchesPlayed}</TableCell>
                <TableCell className="text-blue-500 text-center">{standing.wings}</TableCell>
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
      </div>
    </>
  );
};