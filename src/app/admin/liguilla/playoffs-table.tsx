'use client';

import { type FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MATCH_STATUS } from '@/shared/enums';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { ROUTES } from '@/shared/constants/routes';
import type { PLAYOFFS_TYPE } from './(actions)/fetch-playoff.action';

type Props = Readonly<{
  playoffs: PLAYOFFS_TYPE[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}>;

export const PlayoffsTable: FC<Props> = ({
  playoffs,
  pagination,
}) => {
  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow className="h-16">
                <TableHead>Torneo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Equipos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(playoffs.length > 0) && playoffs.map((playoff) => (
                <TableRow key={playoff.id}>
                  <TableCell>
                    <Link
                      href={`${ROUTES.ADMIN_TOURNAMENT(playoff.tournament.id)}`}
                      target="_blank"
                    >
                      {playoff.tournament.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {playoff.category ? (
                      <Badge variant="outline-info">{playoff.category.name}</Badge>
                    ) : (
                      <Badge variant="outline-secondary">No disponible</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline-info">{playoff.teamsCount}</Badge>
                  </TableCell>
                  {/* <TableCell>
                    {match.matchDate ? (
                      <span className="font-semibold text-gray-600 dark:text-gray-500">
                        {format(match.matchDate as Date, 'EEE dd MMM, y', { locale: es }).toUpperCase()}
                      </span>
                    ) : (
                      <Badge variant="outline-secondary">No disponible</Badge>
                    )}
                  </TableCell> */}
                  {/* <TableCell className="font-semibold text-gray-600 dark:text-gray-500">
                    {match.matchDate ? (
                      formatInTimeZone(match.matchDate as Date, 'America/Mexico_City', 'h:mm a', { locale: es })
                    ) : (
                      <Badge variant="outline-secondary">No disponible</Badge>
                    )}
                  </TableCell> */}
                  <TableCell>
                    <div className="flex gap-3">
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            href={ROUTES.ADMIN_PLAYOFFS_SHOW(playoff.id)}
                            className={buttonVariants({
                              variant: 'outline-info',
                              size: 'icon',
                            })}
                          >
                            <InfoIcon />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          detalles
                        </TooltipContent>
                      </Tooltip>
                      {/* <EditMatch matchId={match.id} /> */}
                      {/* <DeleteMatch
                        id={match.id}
                        roles={roles}
                        status={match.status}
                        /> */}
                      <p className="text-amber-500">EDITAR</p>
                      <p className="text-pink-500">ELIMINAR</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {playoffs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="text-blue-500 text-semibold text-2xl text-center py-5">
                      No hay liguillas disponibles
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className={cn('flex justify-center mt-10', {
          hidden: playoffs.length === 0 || pagination.totalPages === 1,
        })}>
          <Pagination totalPages={pagination.totalPages} />
        </div>
      </div>
    </>
  );
};
