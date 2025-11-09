import type { FC } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Flag, Pencil } from "lucide-react";
import { Badge } from "@/root/src/components/ui/badge";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { fetchTeamAction } from "../(actions)";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

export const TeamPage: FC<Props> = async ({ params }) => {
  const session = await auth();
  const permalink = (await params).permalink;

  const response = await fetchTeamAction(permalink, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/equipos?error=${encodeURIComponent(response.message)}`);
  }

  const team = response.team!;

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800 relative">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              <h1 className="text-xl font-bold text-green-500">Detalles del Equipo</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
              {
                !team.imageUrl ? (
                  <div className="bg-gray-200 dark:bg-gray-800 size-[512px] rounded-xl flex items-center justify-center">
                    <Flag size={480} strokeWidth={1} className="stroke-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={team.imageUrl}
                    width={512}
                    height={512}
                    alt={`imagen de perfil de ${team.name}`}
                    className="rounded-lg size-[512px] object-cover"
                  />
                )
              }
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-semibold w-[180px]">Nombre Completo</TableHead>
                    <TableCell>{team.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Sede</TableHead>
                    <TableCell>{team.headquarters}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">División</TableHead>
                    <TableCell>{team.division}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Grupo</TableHead>
                    <TableCell>{team.group}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">País</TableHead>
                    <TableCell>{team.country}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableCell>{team.state}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">City</TableHead>
                    <TableCell>{team.city}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Torneo</TableHead>
                    <TableCell>
                      {team.tournament ? (
                        <Link href={`/admin/torneos/${team.tournament.permalink}`}>
                          {team.tournament.name}
                        </Link>
                      ) : (
                        <Badge variant="outline-secondary">No Asignado</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Entrenador</TableHead>
                    <TableCell>
                      {(team.coach) ? (
                        <Link href={`/admin/entrenadores/perfil/${team.coach?.id}`}>
                          {team.coach.name}
                        </Link>
                      ) : (
                        <Badge variant="outline-secondary">No Asignado</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium w-[180px]">Estado</TableHead>
                    <TableCell>
                      {
                        team.active
                          ? <Badge variant="outline-info">Activo</Badge>
                          : <Badge variant="outline-warning">No Activo</Badge>
                      }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            <section>
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="w-full lg:w-1/2">
                  <h2 className="text-xl font-bold text-sky-600 mb-5">Jugadores</h2>
                  {
                    !team.players ? (
                      <div className="border-2 border-cyan-600 rounded-lg px-2 py-4">
                        <p className="text-cyan-600 text-center font-bold">Aún no hay jugadores registrados</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {team.players.map(({ id, name }) => (
                          <Link key={id} href={`/admin/jugadores/perfil/${id}`}>
                            <Badge variant="outline-info">{name}</Badge>
                          </Link>
                        ))}
                      </div>
                    )
                  }
                </div>
                <div className="w-full lg:w-1/2">
                  <h2 className="text-xl font-bold text-sky-600">Datos Adicionales</h2>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableHead className="w-[180px] font-semibold">Enlace Permanente</TableHead>
                        <TableCell>{team.permalink}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="w-[180px] font-semibold">Dirección</TableHead>
                        <TableCell>{team.address ?? 'No especificada'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="w-[180px] font-semibold">Fecha de Creación</TableHead>
                        <TableCell>
                          {format(new Date(team?.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="w-[180px] font-semibold">Última actualización</TableHead>
                        <TableCell>
                          {format(new Date(team?.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/equipos/editar/${team.permalink}`}>
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

export default TeamPage;