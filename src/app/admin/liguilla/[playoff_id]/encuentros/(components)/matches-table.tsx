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
import { MATCH_STATUS, PLAYOFF_ROUND } from '@/shared/enums';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { PLAYOFF_MATCH } from '../(actions)/fetch-playoff-matches.action';
import { formatInTimeZone } from 'date-fns-tz';
import { ROUTES } from '@/shared/constants/routes';
import { DeleteMatch } from './delete-match';
import { ShowInfo } from './show-info';
import { EditMatch } from './edit-match';
import { MatchStatus } from './match-status';
import { FinishMatch } from './finish-match';
import { MatchScoreInput } from './match-score-input';

type Props = Readonly<{
  playoffId: string;
  matches: PLAYOFF_MATCH[];
  authenticatedUserRoles: string[] | null | undefined;
}>;

export const MatchesTable: FC<Props> = ({
  playoffId,
  matches,
  authenticatedUserRoles,
}) => {
  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow className="h-16">
                <TableHead className="w-full md:w-1/2">Encuentro</TableHead>
                <TableHead className="hidden md:table-cell md:min-w-20">Grupo</TableHead>
                <TableHead className="hidden md:table-cell md:min-w-20">Ronda</TableHead>
                <TableHead className="hidden md:table-cell md:min-w-[150px]">Sede</TableHead>
                <TableHead className="w-25">Fecha</TableHead>
                <TableHead className="w-25">Hora</TableHead>
                <TableHead className="w-[120px]" colSpan={2}>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(matches.length > 0) && matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="w-25">
                    <div className="grid grid-cols-[1fr_120px_1fr] gap-2 items-center font-semibold text-gray-500">
                      <div className="text-right">
                        <Link
                          href={ROUTES.ADMIN_TEAMS_SHOW(match.local.id)}
                          target="_blank"
                        >
                          <div className="space-x-2">
                            {(match.penaltyShootout?.status === MATCH_STATUS.COMPLETED) && (
                              <Badge variant="outline-secondary">
                                {match.penaltyShootout.localGoals}
                              </Badge>
                            )}
                            <span>{match.local.name}</span>
                          </div>
                        </Link>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        {match.status !== MATCH_STATUS.COMPLETED ? (
                          <MatchScoreInput
                            matchId={match.id}
                            score={match.localScore as number}
                            local
                          />
                        ) : (
                          <Badge variant="outline">{match.localScore}</Badge>
                        )}
                        <Minus strokeWidth={2} />
                        {match.status !== MATCH_STATUS.COMPLETED ? (
                          <MatchScoreInput
                            matchId={match.id}
                            score={match.visitorScore as number}
                            visitor
                          />
                        ) : (
                          <Badge variant="outline">{match.visitorScore}</Badge>
                        )}
                      </div>
                      <div className="text-left">
                        <Link
                          href={ROUTES.ADMIN_TEAMS_SHOW(match.visitor.id)}
                          target="_blank"
                        >
                          <div className="space-x-2">
                            <span>{match.visitor.name}</span>
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
                  <TableCell>
                    <Badge
                      variant='outline-info'
                      className={cn({
                        'border-amber-500 text-amber-500': match.group === 'gold',
                        'border-gray-400 text-gray-400': match.group === 'silver',
                      })}
                    >
                      {match.group}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline-primary"
                      className={cn({
                        'border-emerald-500 text-emerald-500': match.round === PLAYOFF_ROUND.FINAL,
                        'border-sky-400 text-sky-400': match.round === PLAYOFF_ROUND.SEMI_FINAL,
                        'border-purple-400 text-purple-400': match.round === PLAYOFF_ROUND.QUARTER_FINAL,
                      })}
                    >
                      {match.round}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {match.field ? (
                      <Link
                        href={ROUTES.ADMIN_FIELD(match.field.id)}
                        target="_blank"
                        className="text-balance"
                      >
                        {match.field.name}
                      </Link>
                    ) : (
                      <Badge variant="outline-secondary">no disponible</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {match.matchDate ? (
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {format(match.matchDate as Date, 'EEE dd MMM, y', { locale: es }).toUpperCase()}
                      </span>
                    ) : (
                      <Badge variant="outline-secondary">No disponible</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-blue-600 dark:text-blue-500">
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
                          localScore={match.localScore as number}
                          visitorScore={match.visitorScore as number}
                          localId={match.local.id}
                          visitorId={match.visitor.id}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <ShowInfo playoffId={playoffId} matchId={match.id} />
                      <EditMatch playoffId={playoffId} matchId={match.id} />
                      <DeleteMatch
                        id={match.id}
                        authenticatedUserRoles={authenticatedUserRoles}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {matches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="text-blue-500 text-semibold text-2xl text-center py-5">
                      No hay encuentros disponibles
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
