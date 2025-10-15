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
  Flag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DeleteTeam } from "./(components)/delete-team";
import { fetchTeamsAction } from "./(actions)";
import { ErrorHandler } from "@/root/src/shared/components/errorHandler";
import { auth } from "@/auth.config";

export const TeamsPage = async () => {
  const response = await fetchTeamsAction();
  const teams = response.teams;

  const session = await auth();

  return (
    <>
      <ErrorHandler />
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Lista de Equipos</CardTitle>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/equipos/crear">
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
              {teams && teams.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>División</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead>Torneo</TableHead>
                      <TableHead>Sede</TableHead>
                      <TableHead className="text-center">Activo</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>
                          <Link href={`/admin/equipos/${team.permalink}`}>
                            {
                              !team.imageUrl ? (
                                <figure className="bg-gray-800 size-[60px] rounded-xl flex items-center justify-center">
                                  <Flag size={35} className="stroke-gray-400" />
                                </figure>
                              ) : (
                                <Image
                                  src={team.imageUrl}
                                  alt={`${team.name} picture`}
                                  width={75}
                                  height={75}
                                  className="size-18 rounded-xl object-cover"
                                />
                              )
                            }
                          </Link>
                        </TableCell>
                        <TableCell>{team.name}</TableCell>
                        <TableCell>{team.division}</TableCell>
                        <TableCell>{team.group}</TableCell>
                        <TableCell>{team.tournament}</TableCell>
                        <TableCell>{team.headquarters}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={team.active ? 'outline-success' : 'outline-secondary'}>
                            {team.active ? <Check /> : <CircleOff />}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-3">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/admin/equipos/${team.permalink}`}>
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
                                <Link href={`/admin/equipos/editar/${team.id}`}>
                                  <Button variant="outline-warning" size="icon">
                                    <Pencil />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>editar</p>
                              </TooltipContent>
                            </Tooltip>
                            <DeleteTeam
                              teamId={team.id}
                              roles={session?.user.roles as string[]}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="bg-sky-600 p-5 rounded">
                  <p className="text-center text-xl font-bold">Todavía no hay equipos creados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TeamsPage;