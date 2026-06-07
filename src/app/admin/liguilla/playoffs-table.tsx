'use client';

import { type FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants/routes';
import type { PLAYOFFS_TYPE } from './(actions)/fetch-playoffs.action';
import { ShowDetails } from './(components)/show-details';
import { DeletePlayoff } from './(components)/delete-playoff';

type Props = Readonly<{
  playoffs: PLAYOFFS_TYPE[];
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}>;

export const PlayoffsTable: FC<Props> = ({
  playoffs,
  authenticatedUserId,
  authenticatedUserRoles,
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
                  <TableCell>
                    <div className="flex gap-3">
                      <ShowDetails playoffId={playoff.id} />
                      <DeletePlayoff
                        id={playoff.id}
                        authenticatedUserId={authenticatedUserId}
                        authenticatedUserRoles={authenticatedUserRoles}
                      />
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
