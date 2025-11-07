import type { FC } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { DeleteTeam } from "../(components)/delete-team";
import { fetchTeamsAction, updateTeamStateAction } from "../(actions)";
import { auth } from "@/auth.config";
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  InfoIcon,
  Flag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ActiveSwitch } from '@/shared/components/active-switch';

type Props = Readonly<{
  query: string;
  currentPage: number;
}>;

export const TeamsTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await auth();
  const {
    teams = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchTeamsAction({
    page: currentPage,
    take: 8,
    searchTerm: query,
  });

  return (
    <>
      {teams && teams.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>División</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Torneo</TableHead>
                  <TableHead>Entrenador</TableHead>
                  <TableHead className="text-center">Jugadores</TableHead>
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
                    <TableCell>
                      {team.tournament ? (
                        <Link href={`/admin/torneos/${team.tournament.permalink}`}>
                          {team.tournament.name}
                        </Link>
                      ) : (
                        <Badge variant="outline-secondary">No Asignado</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {team.coach ? (
                        <Link href={`/admin/entrenadores/perfil/${team.coach.id}`}>
                          {team.coach.name}
                        </Link>
                      ) : (
                        <Badge variant="outline-secondary">No Asignado</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline-primary">{team.playersCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <ActiveSwitch
                        resource={{ id: team.id, state: team.active }}
                        updateResourceStateAction={updateTeamStateAction}
                      />
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
                            <Link href={`/admin/equipos/editar/${team.permalink}`}>
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
          </div>
          <div className={cn("flex justify-center mt-10", {
            'hidden': pagination!.totalPages === 1,
          })}>
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No hay equipos
          </p>
        </div>
      )}
    </>
  );

};

export default TeamsTable;
