import { Suspense, type FC } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Table, TableBody, TableHead, TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { fetchTournamentAction } from "../(actions)";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { TournamentType } from "../(actions)/fetchTournamentAction";
import { getGenderTranslation, getStageTranslation } from "@/lib/utils";
import { headers } from "next/headers";

type TournamentPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

type TournamentContentProps = Readonly<{
  paramsPromise: Promise<{ id: string }>;
}>;

const TournamentPage: FC<TournamentPageProps> = ({ params }) => {
  return (
    <Suspense>
      <TournamentContent paramsPromise={params} />
    </Suspense>
  );
};

const TournamentContent: FC<TournamentContentProps> = async ({ paramsPromise }) => {
  const tournamentId = (await paramsPromise).id;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const response = await fetchTournamentAction(tournamentId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/torneos?error=${encodeURIComponent(response.message)}`);
  }

  const tournament = response.tournament as TournamentType;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Información del Torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
              <div className="w-full xl:max-w-lg flex justify-center">
                {
                  !tournament.imageUrl ? (
                    <div className="bg-gray-200 dark:bg-gray-800 size-[512px] rounded-xl flex items-center justify-center">
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
                          <TableHead className="font-semibold">
                            <p className="text-wrap">Enlace Permanente</p>
                          </TableHead>
                          <TableCell>
                            <p className="whitespace-break-spaces">{tournament.permalink}</p>
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
                          <TableHead className="font-semibold">Rama</TableHead>
                          <TableCell>
                            {getGenderTranslation(tournament.gender)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className="font-semibold">Jornada</TableHead>
                          <TableCell>
                            <Badge variant={(tournament.currentWeek as number > 0) ? 'outline-info' : 'outline-secondary'}>
                              {tournament.currentWeek}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className="font-semibold">Fase</TableHead>
                          <TableCell>
                            <Badge variant={getStageTranslation(tournament.stage).variant}>
                              {getStageTranslation(tournament.stage).label}
                            </Badge>
                          </TableCell>
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
                          <TableHead className="font-semibold">
                            Ciudad
                          </TableHead>
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
                              {format(new Date(tournament.startDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                            </p>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className="font-semibold">Fecha Final</TableHead>
                          <TableCell>
                            <p className="text-pretty">
                              {format(new Date(tournament.endDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                            </p>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className="font-semibold">
                            Equipos
                          </TableHead>
                          <TableCell>
                            <Badge
                              variant={(tournament.teamsQuantity > 0)
                                ? "outline-info"
                                : "outline-secondary"
                              }
                            >
                              {tournament.teamsQuantity}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead className="font-medium">Activo</TableHead>
                          <TableCell>
                            {
                              tournament.active
                                ? <Badge variant="outline-info">activo</Badge>
                                : <Badge variant="outline-secondary">desactivado</Badge>
                            }
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

            <section>
              <h2 className="text-lg font-semibold text-sky-600 mb-5">
                Equipos Registrados&nbsp;
                <span className="text-gray-500 text-base font-semibold">
                  ({tournament.teams.length})
                </span>
              </h2>
              {
                tournament.teams.length === 0 ? (
                  <div className="border-2 border-cyan-600 rounded-lg px-2 py-4">
                    <p className="text-cyan-600 text-center font-bold">Aún no hay equipos registrados</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {tournament.teams.map(({ id, name }) => (
                      <Link key={id} href={`/admin/equipos/${id}`}>
                        <Badge variant="outline-info">{name}</Badge>
                      </Link>
                    ))}
                  </div>
                )
              }
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/torneos/editar/${tournament.id}`}>
                    <Button variant="outline-warning" size="icon">
                      <Pencil />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>editar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentPage;