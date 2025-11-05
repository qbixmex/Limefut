import type { FC } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth.config";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Badge } from "@/root/src/components/ui/badge";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { fetchPlayerAction } from "../../(actions)";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SoccerPlayer } from "@/shared/components/icons";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const PlayerPage: FC<Props> = async ({ params }) => {
  const session = await auth();
  const playerId = (await params).id;

  const response = await fetchPlayerAction(playerId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/jugadores?error=${encodeURIComponent(response.message)}`);
  }

  const player = response.player!;

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800 relative">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              <h1 className="text-xl font-bold text-green-500">Detalles del Jugador</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
              {
                !player.imageUrl ? (
                  <div className="bg-gray-200 dark:bg-gray-800 size-[512px] rounded-xl flex items-center justify-center">
                    <SoccerPlayer size={480} strokeWidth={2} className="text-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={player.imageUrl}
                    width={512}
                    height={512}
                    alt={`imagen de perfil de ${player.name}`}
                    className="rounded-lg size-[512px] object-cover"
                  />
                )
              }
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-semibold w-[180px]">Nombre Completo</TableHead>
                    <TableCell>{player.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Correo Electrónico</TableHead>
                    <TableCell>{player.email ?? 'No Proporcionado'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Teléfono</TableHead>
                    <TableCell>{player.phone ?? 'No Proporcionado'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Fecha de Nacimiento</TableHead>
                    <TableCell>
                      {
                        player.birthday
                          ? format(player.birthday as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
                          : 'No Proporcionado'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Nacionalidad</TableHead>
                    <TableCell>{player.nationality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Equipo</TableHead>
                    <TableCell>
                      {
                        (player.team)
                          ? (
                            <Badge variant="outline-info">
                              {player.team?.name}
                            </Badge>
                          )
                          : (
                            <Badge variant="outline-secondary">
                              Sin equipo asignado
                            </Badge>
                          )
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">Fecha de creación</TableHead>
                    <TableCell>
                      {format(new Date(player?.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">Última Actualización</TableHead>
                    <TableCell>
                      {format(new Date(player?.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium w-[180px]">Estado</TableHead>
                    <TableCell>
                      {
                        player.active
                          ? <Badge variant="outline-info">Activo</Badge>
                          : <Badge variant="outline-warning">No Activo</Badge>
                      }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/jugadores/editar/${player.id}`}>
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

export default PlayerPage;