import type { FC } from "react";
import {
  fetchTournamentAction,
  type TournamentType,
} from "../../(actions)/fetchTournamentAction";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Trophy, Shield } from "lucide-react";
import Link from "next/link";
import { Heading } from "../../../components";
import { Table, TableBody, TableCell, TableHead, TableRow } from "~/src/components/ui/table";
import { ErrorHandler } from "~/src/shared/components/errorHandler";
import { format as formatDate } from "date-fns";
import { es } from "date-fns/locale";
import "./style.css";

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>
  searchParams: Promise<{
    categoria?: string;
    formato?: string;
  }>;
}>;

export const Tournament: FC<Props> = async ({ params, searchParams }) => {
  const permalink = (await params).permalink;
  const {
    categoria: category,
    formato: format,
  } = await searchParams;

  if (!category || !format) {
    redirect(`/torneos?error=${encodeURIComponent('¡ La categoría y formato son obligatorios !')}`);
  }

  const response = await fetchTournamentAction(permalink, category, format);

  if (!response.ok) {
    redirect(`/torneos?error=${encodeURIComponent(response.message)}`);
  }

  const tournament = response.tournament as TournamentType;

  return (
    <>
      <ErrorHandler />
      <Heading level="h1" className="text-emerald-600 mb-5">
        {tournament.name}
      </Heading>

      <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
        <div className="w-full xl:max-w-lg flex justify-center">
          {
            !tournament.imageUrl ? (
              <div className="border-2 border-gray-200 dark:border-gray-700/80 size-[512px] rounded-xl flex items-center justify-center">
                <Trophy size={480} strokeWidth={1} className="stroke-gray-400" />
              </div>
            ) : (
              <Image
                src={tournament.imageUrl}
                width={500}
                height={500}
                alt={tournament.name}
                className="w-full max-w-lg h-auto rounded-lg object-cover"
              />
            )
          }
        </div>
        <div className="w-full">
          <div className="w-full flex flex-col gap-0 lg:flex-row lg:gap-5 mb-5">
            <div className="w-full lg:w-1/2">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="w-auto md:w-28 font-semibold">Nombre</TableHead>
                    <TableCell>
                      <p className="text-pretty">{tournament.name}</p>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Temporada</TableHead>
                    <TableCell>{tournament.season}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Categoría</TableHead>
                    <TableCell>{tournament.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Formato</TableHead>
                    <TableCell>
                      {tournament.format} vs {tournament.format}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Jornada</TableHead>
                    <TableCell>{tournament.currentWeek}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="w-full lg:w-1/2">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="w-auto md:w-28 font-semibold">País</TableHead>
                    <TableCell>{tournament.country}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableCell>{tournament.state}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">City</TableHead>
                    <TableCell>
                      <p className="text-wrap">{tournament.city}</p>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">
                      <p className="text-wrap">Fecha Inicial</p>
                    </TableHead>
                    <TableCell>
                      <p className="text-pretty">
                        {formatDate(new Date(tournament.startDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </p>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Fecha Final</TableHead>
                    <TableCell>
                      <p className="text-pretty">
                        {formatDate(new Date(tournament.endDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </p>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <section>
            <p className="font-semibold mb-2">Descripción</p>
            <p className="text-pretty">{tournament.description}</p>
          </section>
        </div>
      </section>

      <h2 className="teamsSubheading">Equipos</h2>

      {(tournament.teams.length > 0) ? (
        <section className="teams">
          {tournament.teams.map((team) => (
            <section key={team.id} className="teamCard">
              <Link
                href={
                  `/equipos/${team.permalink}`
                  + `?torneo=${tournament.permalink}`
                  + `&categoria=${team.category}`
                  + `&formato=${team.format}`
                }
              >
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
              <Link href={
                `/equipos/${team.permalink}`
                + `?torneo=${tournament.permalink}`
                + `&categoria=${team.category}`
                + `&formato=${team.format}`
              }>
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
