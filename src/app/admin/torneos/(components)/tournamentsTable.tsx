import type { FC } from 'react';
import Link from 'next/link';
import Image from "next/image";
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
  Trophy,
} from "lucide-react";
import { fetchTournamentsAction, updateTournamentStateAction } from "../(actions)";
import { auth } from '@/lib/auth';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DeleteTournament } from './delete-tournament';
import { Pagination } from '@/shared/components/pagination';
import { cn, getStageTranslation } from '@/lib/utils';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { Badge } from '~/src/components/ui/badge';
import { headers } from 'next/headers';

type Props = Readonly<{
  query: string;
  currentPage: string;
}>;

export const TournamentsTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {
    tournaments = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchTournamentsAction({
    page: Number(currentPage),
    take: 12,
    searchTerm: query,
  });

  return (
    <>
      {tournaments && tournaments.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] hidden lg:table-cell">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-25 text-center">Categoría</TableHead>
                  <TableHead className="w-25 text-center">Formato</TableHead>
                  <TableHead className="hidden lg:table-cell w-25 text-center">Temporada</TableHead>
                  <TableHead className="hidden lg:table-cell w-25 text-center">Jornada</TableHead>
                  <TableHead className="hidden lg:table-cell w-25 text-center">Equipos</TableHead>
                  <TableHead className="hidden lg:table-cell w-25 text-center">Fase</TableHead>
                  <TableHead className="hidden lg:table-cell text-center">Activo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="hidden lg:table-cell">
                      <Link href={`/admin/torneos/${tournament.id}`}>
                        {
                          !tournament.imageUrl ? (
                            <figure className="border border-gray-400 dark:border-0 dark:bg-gray-800 size-[60px] rounded-lg flex items-center justify-center">
                              <Trophy size={35} className="stroke-gray-400" />
                            </figure>
                          ) : (
                            <Image
                              src={tournament.imageUrl}
                              alt={`${tournament.name} picture`}
                              width={75}
                              height={75}
                              className="size-18 rounded-xl object-cover"
                            />
                          )
                        }
                      </Link>
                    </TableCell>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell className="text-center">{tournament.category}</TableCell>
                    <TableCell className="text-center">
                      {`${tournament.format} vs ${tournament.format}`}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      {tournament.season}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <Badge
                        variant={(tournament.currentWeek as number > 0)
                          ? "outline-info"
                          : "outline-secondary"
                        }
                      >
                        {tournament.currentWeek}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <Badge
                        variant={(tournament.teamsQuantity > 0)
                          ? "outline-info"
                          : "outline-secondary"
                        }
                      >
                        {tournament.teamsQuantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <Badge variant={getStageTranslation(tournament.stage).variant}>
                        {getStageTranslation(tournament.stage).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <ActiveSwitch
                        resource={{ id: tournament.id, state: tournament.active }}
                        updateResourceStateAction={updateTournamentStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/torneos/${tournament.id}`}>
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
                            <Link href={`/admin/torneos/editar/${tournament.id}`}>
                              <Button variant="outline-warning" size="icon">
                                <Pencil />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>editar</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteTournament
                          tournamentId={tournament.id}
                          roles={session?.user.roles as string[] ?? null}
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
            No hay torneos
          </p>
        </div>
      )}
    </>
  );
};

export default TournamentsTable;
