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

type Props = Readonly<{
  matches: MATCH_TYPE[];
  matchesWeeks: number[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  roles: string[];
}>;

export const MatchesTable: FC<Props> = ({
  matches,
  matchesWeeks,
  pagination,
  roles,
}) => {
  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <Table>
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
                        <Link href={ROUTES.ADMIN_TEAMS_SHOW(match.localTeam.id)}>
                          <div className="space-x-2">
                            {(match.penaltyShootout?.status === MATCH_STATUS.COMPLETED) && (
                              <Badge variant="outline-secondary">
                                {match.penaltyShootout.localGoals}
                              </Badge>
                            )}
                            <span>{match.localTeam.name}</span>
                          </div>
                        </Link>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        {match.status !== MATCH_STATUS.COMPLETED ? (
                          <MatchScoreInput
                            matchId={match.id}
                            score={match.localScore}
                            local
                          />
                        ) : (
                          <Badge variant="outline">{match.localScore}</Badge>
                        )}
                        <Minus strokeWidth={2} />
                        {match.status !== MATCH_STATUS.COMPLETED ? (
                          <MatchScoreInput
                            matchId={match.id}
                            score={match.visitorScore}
                            visitor
                          />
                        ) : (
                          <Badge variant="outline">{match.visitorScore}</Badge>
                        )}
                      </div>
                      <div className="text-left">
                        <Link href={ROUTES.ADMIN_TEAMS + match.visitorTeam.id}>
                          <div className="space-x-2">
                            <span>{match.visitorTeam.name}</span>
                            {(match.penaltyShootout?.status === MATCH_STATUS.COMPLETED) && (
                              <Badge variant="outline-secondary">
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
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="font-semibold text-gray-600 dark:text-gray-500 text-balance">
                          {match.field.name}
                        </span>
                      </Link>
                    ) : (
                      <Badge variant="outline-secondary">no disponible</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {match.week ? (
                      <Badge variant="outline-info">
                        {match.week}
                      </Badge>
                    ) : (
                      <Badge variant="outline-secondary">
                        <span>ninguna</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {match.matchDate ? (
                      <span className="font-semibold text-gray-600 dark:text-gray-500">
                        {format(match.matchDate as Date, 'EEE dd MMM, y', { locale: es }).toUpperCase()}
                      </span>
                    ) : (
                      <Badge variant="outline-secondary">No disponible</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-600 dark:text-gray-500">
                    {match.matchDate ? (
                      formatInTimeZone(match.matchDate as Date, 'America/Mexico_City', 'h:mm a', { locale: es })
                    ) : (
                      <Badge variant="outline-secondary">No disponible</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {match.status === MATCH_STATUS.COMPLETED ? (
                      <div className="w-full max-w-[150px] border border-emerald-500 text-center rounded-lg py-2 px-4">
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
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            href={ROUTES.ADMIN_MATCHES_SHOW(match.id)}
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
                      <EditMatch matchId={match.id} />
                      <DeleteMatch
                        id={match.id}
                        roles={roles}
                        status={match.status}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {matches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="text-blue-500 text-semibold text-2xl text-center py-5">
                      No hay encuentros
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div
          className={cn('flex justify-center mt-10', {
            hidden: matches.length === 0 || pagination!.totalPages === 1,
          })}
        >
          <Pagination totalPages={pagination!.totalPages as number} />
        </div>
      </div>
    </>
  );
};
