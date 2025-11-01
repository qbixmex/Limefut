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
import { GiWhistle } from "react-icons/gi";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DeleteCoach } from "./(components)/delete-coach";
import { fetchCoachesAction } from "./(actions)";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { auth } from "@/auth.config";

export const CoachesPage = async () => {
  const response = await fetchCoachesAction();
  const coaches = response.coaches;

  const session = await auth();

  return (
    <>
      <ErrorHandler />
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Lista de Entrenadores</CardTitle>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/entrenadores/crear">
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
              {coaches && coaches.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Correo Electrónico</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead className="text-center">Equipos</TableHead>
                      <TableHead className="text-center">Activo</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coaches.map((coach) => (
                      <TableRow key={coach.id}>
                        <TableCell>
                          <Link href={`/admin/entrenadores/${coach.id}`}>
                            {
                              !coach.imageUrl ? (
                                <figure className="bg-gray-800 size-[60px] rounded-xl flex items-center justify-center">
                                  <GiWhistle size={35} className="text-gray-300" />
                                </figure>
                              ) : (
                                <Image
                                  src={coach.imageUrl}
                                  alt={`${coach.name} picture`}
                                  width={75}
                                  height={75}
                                  className="size-18 rounded-xl object-cover"
                                />
                              )
                            }
                          </Link>
                        </TableCell>
                        <TableCell>{coach.name}</TableCell>
                        <TableCell>{coach.email}</TableCell>
                        <TableCell>{coach.phone}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline-info">{coach.teamsCount}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={coach.active ? 'outline-success' : 'outline-secondary'}>
                            {coach.active ? <Check /> : <CircleOff />}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-3">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/admin/entrenadores/perfil/${coach.id}`}>
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
                                <Link href={`/admin/entrenadores/editar/${coach.id}`}>
                                  <Button variant="outline-warning" size="icon">
                                    <Pencil />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>editar</p>
                              </TooltipContent>
                            </Tooltip>
                            <DeleteCoach
                              coachId={coach.id}
                              roles={session?.user.roles as string[]}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="border border-sky-600 p-5 rounded">
                  <p className="text-sky-500 text-center text-xl font-semibold">
                    Todavía no hay entrenadores creados
                  </p>
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