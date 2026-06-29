import { Suspense, type FC } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { Table, TableBody, TableHead, TableCell, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TournamentType } from '../(actions)';
import { fetchTournamentAction } from '../(actions)';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStageTranslation } from '@/lib/utils';
import { headers } from 'next/headers';
import { DeleteTournamentImage } from '../(components)/delete-tournament-image';
import { EditTournament } from '../(components)/edit-tournament';
import { ROUTES } from '@/shared/constants/routes';

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
    redirect(`${ROUTES.ADMIN_TOURNAMENTS}?error=${encodeURIComponent(response.message)}`);
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
                    <div className="bg-gray-200 dark:bg-gray-800 w-full max-w-[512px] h-auto rounded-xl flex items-center justify-center">
                      <Trophy size={512} strokeWidth={1} className="stroke-gray-400" />
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="w-full max-w-[512px] h-auto relative">
                        <Image
                          src={tournament.imageUrl}
                          width={512}
                          height={512}
                          alt={tournament.name}
                          className="w-full max-w-[512px] h-auto rounded-lg object-cover"
                        />
                        <DeleteTournamentImage
                          teamId={tournament.id}
                          roles={session?.user.roles as string[]}
                          className="absolute top-2 right-2"
                        />
                      </div>
                    </div>
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
                            <p className="text-wrap">{tournament.name}</p>
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
                          <TableHead className="font-semibold">
                            Ciudades
                          </TableHead>
                          <TableCell>
                            <p className="text-wrap">{tournament.cities.join(', ')}</p>
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
              </div>
            </section>

            <section className="mb-5">
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-500 mb-2">Descripción</p>
              {tournament.description ? (
                <p className="text-pretty">{tournament.description}</p>
              ) : (
                <Badge variant="outline-secondary">No suministrada</Badge>
              )}
            </section>

            <section className="mb-5">
              <h2 className="text-lg font-semibold text-emerald-600 dark:text-emerald-500 mb-5">
                Categorías{' '}
                <span className="text-gray-500 text-base font-semibold">
                  ({tournament.categories.length})
                </span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {(tournament.categories.length > 0) && (
                  tournament.categories.map((category) => (
                    <Badge key={category.id} variant="outline-info">
                      {category.name}
                    </Badge>
                  ))
                )}

                {(tournament.categories.length === 0) && (
                  <Badge variant="outline-secondary">
                    No asociadas
                  </Badge>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-emerald-600 dark:text-emerald-500 mb-5">
                Equipos Registrados{' '}
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
              <EditTournament tournamentId={tournamentId} side="left" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentPage;
