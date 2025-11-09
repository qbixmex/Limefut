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
import { auth } from '@/auth';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DeleteTournament } from './delete-tournament';
import { es } from 'date-fns/locale';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import { ActiveSwitch } from '@/shared/components/active-switch';

type Props = Readonly<{
  query: string;
  currentPage: number;
}>;

export const TournamentsTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await auth();
  const {
    tournaments = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchTournamentsAction({
    page: currentPage,
    take: 6,
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
                  <TableHead className="w-[100px]">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-[100px]">Temporada</TableHead>
                  <TableHead className="w-[200px]">Fecha de Inicio</TableHead>
                  <TableHead className="w-[200px]">Fecha Final</TableHead>
                  <TableHead className="text-center">Activo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell>
                      <Link href={`/admin/torneos/${tournament.permalink}`}>
                        {
                          !tournament.imageUrl ? (
                            <figure className="bg-gray-800 size-[60px] rounded-xl flex items-center justify-center">
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
                    <TableCell>{tournament.season}</TableCell>
                    <TableCell>
                      {format(new Date(tournament.startDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(tournament.endDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                    <TableCell className="text-center">
                      <ActiveSwitch
                        resource={{ id: tournament.id, state: tournament.active }}
                        updateResourceStateAction={updateTournamentStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/torneos/${tournament.permalink}`}>
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
                            <Link href={`/admin/torneos/editar/${tournament.permalink}`}>
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
            No hay torneos
          </p>
        </div>
      )}
    </>
  );
};

export default TournamentsTable;
