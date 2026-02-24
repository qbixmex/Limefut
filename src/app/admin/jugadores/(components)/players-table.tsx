import type { FC } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { auth } from "@/lib/auth";
import { fetchPlayersAction, updatePlayerStateAction } from "../(actions)";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SoccerPlayer } from "@/shared/components/icons";
import { Badge } from "@/components/ui/badge";
import { DeletePlayer } from "../(components)/delete-player";
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { headers } from 'next/headers';

type Props = Readonly<{
  teamId: string;
  query: string;
  currentPage: number;
}>;

export const PlayersTable: FC<Props> = async ({ teamId, query, currentPage }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {
    players = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchPlayersAction(
    teamId,
    {
      page: currentPage,
      take: 12,
      searchTerm: query,
    },
  );

  return (
    <>
      {players && players.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo de Contacto</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead className="text-center">Activo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <Link href={`/admin/jugadores/perfil/${player.id}`}>
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
                    <TableCell>{player.email ?? 'No proporcionado'}</TableCell>
                    <TableCell>
                      <Link href={`/admin/equipos/${player.team?.permalink}`}>
                        {
                          player.team ? (
                            <Badge variant="outline-info">
                              {player.team?.name}
                            </Badge>
                          ) : (
                            <Badge variant="outline-secondary">
                              Sin equipo asignado
                            </Badge>
                          )
                        }
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <ActiveSwitch
                        resource={{ id: player.id, state: player.active }}
                        updateResourceStateAction={updatePlayerStateAction}
                      />
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
                        <DeletePlayer
                          playerId={player.id}
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
            No hay jugadores asignados a este equipo
          </p>
        </div>
      )}
    </>
  );

};

export default PlayersTable;
