import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  CircleOff,
  Pencil,
  InfoIcon,
  Plus,
} from "lucide-react";
import { SoccerPlayer } from "@/shared/components/icons";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
// import { DeleteCoach } from "./(components)/delete-coach";
import { fetchPlayersAction } from "./(actions)";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { auth } from "@/auth.config";

export const CoachesPage = async () => {
  const response = await fetchPlayersAction();
  const players = response.players;

  const session = await auth();

  return (
    <>
      <ErrorHandler />
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Lista de Jugadores</CardTitle>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/jugadores/crear">
                      <Button variant="outline-primary" size="icon">
                        <Plus strokeWidth={3} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>crear</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              {players && players.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Correo de Contacto</TableHead>
                      <TableHead>Teléfono de Contacto</TableHead>
                      <TableHead className="text-center">Activo</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>
                          <Link href={`/admin/jugadores/${player.id}`}>
                            {
                              !player.imageUrl ? (
                                <figure className="bg-gray-800 size-[60px] rounded-xl flex items-center justify-center">
                                  <SoccerPlayer size={35} className="text-gray-300" />
                                </figure>
                              ) : (
                                <Image
                                  src={player.imageUrl}
                                  alt={`${player.name} picture`}
                                  width={75}
                                  height={75}
                                  className="size-18 rounded-xl object-cover"
                                />
                              )
                            }
                          </Link>
                        </TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.email}</TableCell>
                        <TableCell>{player.phone}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={player.active ? 'outline-success' : 'outline-secondary'}>
                            {player.active ? <Check /> : <CircleOff />}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-3">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/admin/jugadores/perfil/${player.id}`}>
                                  <Button variant="outline-info" size="icon">
                                    <InfoIcon />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                detalles
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/admin/jugadores/editar/${player.id}`}>
                                  <Button variant="outline-warning" size="icon">
                                    <Pencil />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>editar</p>
                              </TooltipContent>
                            </Tooltip>
                            {/* <DeleteCoach
                              coachId={player.id}
                              roles={session?.user.roles as string[]}
                            /> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="bg-sky-600 p-5 rounded">
                  <p className="text-center text-xl font-bold">Todavía no hay jugadores creados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CoachesPage;