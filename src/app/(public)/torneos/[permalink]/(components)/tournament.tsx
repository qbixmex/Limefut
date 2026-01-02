import type { FC } from "react";
import {
  fetchTournamentAction,
  type TournamentType,
} from "../../(actions)/fetchTournamentAction";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Flag, Shield } from "lucide-react";
import Link from "next/link";
import { Heading } from "../../../components";
import { Table, TableBody, TableCell, TableHead, TableRow } from "~/src/components/ui/table";
import "./style.css";

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>
}>;

export const Tournament: FC<Props> = async ({ params }) => {
  const permalink = (await params).permalink;

  const response = await fetchTournamentAction(permalink);

  if (!response.ok) {
    redirect('/torneos');
  }

  const tournament = response.tournament as TournamentType;

  return (
    <>
      <Heading level="h1" className="text-emerald-600 mb-5">
        Torneo {tournament.name}
      </Heading>

      <div className="flex flex-col lg:flex-row gap-10 mb-5">
        <div className="w-[500px]">
          {!tournament.imageUrl ? (
            <div className="image-placeholder">
              <Flag
                size={450}
                strokeWidth={1}
                className="image-placeholder-icon"
              />
            </div>
          ) : (
            <Image
              src={tournament.imageUrl}
              width={500}
              height={500}
              className=""
              alt={`${tournament.name} torneo`}
            />
          )}
        </div>
        <div>
          <div className="description">
            <h2 >
              Descripción
            </h2>
            <p>{tournament.description}</p>
          </div>

          <Table className="table">
            <TableBody>
              <TableRow>
                <TableHead className="w-64">División:</TableHead>
                <TableCell>{tournament.division}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Grupo:</TableHead>
                <TableCell>{tournament.group}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>País:</TableHead>
                <TableCell>{tournament.country}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Estado:</TableHead>
                <TableCell>{tournament.state}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Ciudad:</TableHead>
                <TableCell>{tournament.city}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Temporada:</TableHead>
                <TableCell>{tournament.season}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Fecha de Inicio:</TableHead>
                <TableCell>{tournament.season}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Fecha de Inicio:</TableHead>
                <TableCell>{tournament.startDate.toDateString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Fecha final del torneo:</TableHead>
                <TableCell>{tournament.endDate.toDateString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Jornada Actual</TableHead>
                <TableCell>{tournament.currentWeek}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <h2 className="teamsSubheading">Equipos</h2>

      {(tournament.teams.length > 0) ? (
        <section className="teams">
          {tournament.teams.map((team) => (
            <section key={team.id} className="teamCard">
              <Link href={`/equipos/${team.permalink}`}>
                {!team.imageUrl ? (
                  <Shield className="text-gray-400" />
                ) : (
                  <Image
                    src={team.imageUrl}
                    width={200}
                    height={200}
                    className="object-contain"
                    alt={`${team.name} equipo`}
                  />
                )}
              </Link>
              <Link href={`/equipos/${team.permalink}`}>
                {team.name}
              </Link>
            </section>
          ))}
        </section>
      ) : (
        <div className="border-2 border-sky-600 dark:border-sky-500 py-6 rounded-lg mb-5">
          <p className="text-2xl text-center text-sky-600 dark:text-sky-500">
            ¡ El torneo aún no tiene equipos asignados !
          </p>
        </div>
      )}
    </>
  );
};

export default Tournament;
