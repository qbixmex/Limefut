'use client';

import type { FC } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { DeleteTeam } from "../(components)/delete-team";
import { updateTeamStateAction } from "../(actions)";
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
import type { TeamType } from '../(actions)/fetchTeamsAction';

type Props = Readonly<{
  teams: TeamType[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  roles: string[];
}>;

export const TeamsTable: FC<Props> = ({ teams, pagination, roles }) => {
  return (
    <>
      {(teams.length > 0) ? (
        <div className="flex-1 flex flex-col mt-10">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="w-25">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-25 text-center">Categoría</TableHead>
                  <TableHead className="w-25 text-center">Formato</TableHead>
                  <TableHead className="w-25 text-center">Rama</TableHead>
                  <TableHead className="w-25">Entrenador</TableHead>
                  <TableHead className="w-25 text-center">Jugadores</TableHead>
                  <TableHead className="w-25 text-center">Activo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-bold text-center">{index + 1}</TableCell>
                    <TableCell>
                      <Link href={`/admin/equipos/${team.id}`}>
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
                    <TableCell className="text-center">{team.category}</TableCell>
                    <TableCell className="text-center">
                      {team.format} vs {team.format}
                    </TableCell>
                    <TableCell className="text-center">
                      {
                        (team.gender === 'male')
                          ? 'Varonil'
                          : (team.gender === 'female')
                            ? 'Femenil'
                            : 'desconocida'
                      }
                    </TableCell>
                    <TableCell>
                      {team.coach ? (
                        <Link href={`/admin/entrenadores/perfil/${team.coach.id}`}>
                          <p className="text-wrap">{team.coach.name}</p>
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
                            <Link href={`/admin/equipos/${team.id}`}>
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
                          roles={roles}
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
        <div className="border border-sky-600 p-5 rounded mt-10">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No se encontraron equipos
          </p>
        </div>
      )}
    </>
  );
};

export default TeamsTable;
