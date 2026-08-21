'use client';

import type { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { DeleteMatch } from '../(components)/delete-match';
import { MATCH_STATUS } from '@/shared/enums';
import { MatchStatus } from '../(components)/match-status';
import { FinishMatch } from '../(components)/finish-match';
import { MatchScoreInput } from '../(components)/match-score-input';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-matches.action';
import { WeeksSelector } from './weeks-selector';
import { DateSelector } from './date-selector';
import { StatusSelector } from './status-selector';
import { formatInTimeZone } from 'date-fns-tz';
import { EditMatch } from './edit-match';
import { ROUTES } from '@/shared/constants/routes';
import { MatchDetails } from './match-details';

type Props = Readonly<{
  matches: MATCH_TYPE[];
  matchesWeeks: number[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}>;

export const MatchesTable: FC<Props> = ({
  matches,
  matchesWeeks,
  pagination,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1">
        <Table aria-label="Tabla de encuentros">
          <TableHeader>
            <TableRow className="h-16">
              <TableHead className="w-full md:w-1/2">Encuentro</TableHead>
              <TableHead className="hidden md:table-cell md:min-w-[150px]">Sede</TableHead>
              <TableHead className="w-25 text-center">
                <WeeksSelector weeks={matchesWeeks} />
              </TableHead>
              <TableHead className="w-25 text-center">
                <DateSelector label="date" />
              </TableHead>
              <TableHead className="w-25">
                <DateSelector label="hour" />
              </TableHead>
              <TableHead className="w-[120px]" colSpan={2}>
                <StatusSelector />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(matches.length > 0) && matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="w-25">
                  <div className="grid grid-cols-[1fr_120px_1fr] gap-2 items-center font-semibold text-gray-500">
                    <div className="text-right">
                      <Link
                        href={ROUTES.ADMIN_TEAMS_SHOW(match.localTeam.id)}
                        title={`Ver detalles del equipo local ${match.localTeam.name}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="space-x-2">
                          {(match.penaltyShootout?.status === MATCH_STATUS.COMPLETED) && (
                            <Badge
                              variant="outline-secondary"
                              role="status"
                              aria-label="Penales local"
                            >
                              {match.penaltyShootout.localGoals}
                            </Badge>
                          )}
                          <span aria-label="Equipo local">
                            {match.localTeam.name}
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      {match.status !== MATCH_STATUS.COMPLETED ? (
                        <MatchScoreInput
                          matchId={match.id}
                          score={match.localScore}
                          local
                          aria-label="Marcador local"
                        />
                      ) : (
                        <Badge
                          variant="outline"
                          role="status"
                          aria-label="Marcador local"
                        >
                          {match.localScore}
                        </Badge>
                      )}
                      <Minus strokeWidth={2} />
                      {match.status !== MATCH_STATUS.COMPLETED ? (
                        <MatchScoreInput
                          matchId={match.id}
                          score={match.visitorScore}
                          visitor
                          aria-label="Marcador visitante"
                        />
                      ) : (
                        <Badge
                          variant="outline"
                          role="status"
                          aria-label="Marcador visitante"
                        >
                          {match.visitorScore}
                        </Badge>
                      )}
                    </div>
                    <div className="text-left">
                      <Link
                        href={ROUTES.ADMIN_TEAMS_SHOW(match.visitorTeam.id)}
                        title={`Ver detalles del equipo visitante ${match.visitorTeam.name}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="space-x-2">
                          <span aria-label="Equipo visitante">
                            {match.visitorTeam.name}
                          </span>

                          {(match.penaltyShootout?.status === MATCH_STATUS.COMPLETED) && (
                            <Badge
                              variant="outline-secondary"
                              role="status"
                              aria-label="Penales visitante"
                            >
                              {match.penaltyShootout.visitorGoals}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {match.field ? (
                    <Link
                      href={ROUTES.ADMIN_FIELDS_SHOW(match.field.id)}
                      title={`Ver detalles de la cancha ${match.field.name}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="font-semibold text-gray-600 dark:text-gray-500 text-balance">
                        {match.field.name}
                      </span>
                    </Link>
                  ) : (
                    <Badge
                      variant="outline-secondary"
                      data-testid={match.id}
                    >
                      no disponible
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline-info"
                    role="status"
                    aria-label="Número de la jornada"
                  >
                    {match.week ?? 'no definida'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {match.matchDate ? (
                    <span
                      className="font-semibold text-gray-600 dark:text-gray-500"
                      role="status"
                      aria-label="Fecha del encuentro"
                    >
                      {format(match.matchDate as Date, 'EEE dd MMM, y', { locale: es }).toUpperCase()}
                    </span>
                  ) : (
                    <Badge
                      variant="outline-secondary"
                      role="status"
                      aria-label="Fecha del encuentro"
                    >
                      No asignada
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-gray-600 dark:text-gray-500">
                  {match.matchDate ? (
                    <span role="status" aria-label="Hora del encuentro">
                      {formatInTimeZone(match.matchDate as Date, 'America/Mexico_City', 'h:mm a', { locale: es })}
                    </span>
                  ) : (
                    <Badge
                      variant="outline-secondary"
                      role="status"
                      aria-label="Hora del encuentro"
                    >
                      No disponible
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {match.status === MATCH_STATUS.COMPLETED ? (
                    <div
                      className="w-full max-w-[150px] border border-emerald-500 text-center rounded-lg py-2 px-4"
                      role="status"
                      aria-label="Estado del encuentro"
                    >
                      <span className="text-emerald-500 font-semibold">Finalizado</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <MatchStatus matchId={match.id} status={match.status} />
                      <FinishMatch
                        matchId={match.id}
                        localScore={match.localScore}
                        visitorScore={match.visitorScore}
                        localId={match.localTeam.id}
                        visitorId={match.visitorTeam.id}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <MatchDetails matchId={match.id} />
                    <EditMatch matchId={match.id} />
                    <DeleteMatch id={match.id} status={match.status} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {
          (matches.length === 0) && (
            <div className="mt-10 border border-blue-500 text-blue-500 text-semibold text-2xl text-center py-5 rounded">
              Aún no hay encuentros programados
            </div>
          )
        }
      </div>
      <div
        className={cn('flex justify-center mt-10', {
          hidden: matches.length === 0 || pagination!.totalPages === 1,
        })}
      >
        <Pagination totalPages={pagination!.totalPages as number} />
      </div>
    </div>
  );
};
