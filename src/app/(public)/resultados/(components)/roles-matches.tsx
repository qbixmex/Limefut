import type { FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import type { MatchType } from '../(actions)/fetchResultsAction';
import { getMatchStatus } from '../(helpers)/status';
import { getMatchesSortedByWeeks } from './utils/get-matches-sorted-by-weeks';
import { getUniqueMatches } from './utils/get-unique-matches';
import Link from 'next/link';

const TIME_ZONE = 'America/Mexico_City';

type Props = Readonly<{ matches: MatchType[] }>;

export const RolesMatches: FC<Props> = ({ matches }) => {
  const matchesByWeek = getUniqueMatches(matches);
  const matchesSortedWeeks = getMatchesSortedByWeeks(matchesByWeek);

  return (
    <>
      {matchesSortedWeeks.map((week) => (
        <div key={week} className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Jornada {week}</h3>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden lg:table-cell">Fecha</TableHead>
                <TableHead className="hidden lg:table-cell">Hora</TableHead>
                <TableHead className="hidden lg:table-cell">Sede</TableHead>
                <TableHead>
                  <div className="grid grid-cols-[1fr_100px_1fr]">
                    <span className="text-right">Equipo Local</span>
                    <span>{' '}</span>
                    <span className="text-left">Equipo Visitante</span>
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell text-left">Estado</TableHead>
                <TableHead className="hidden lg:table-cell">&nbsp;</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchesByWeek[week].map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="hidden lg:table-cell">
                    {match.matchDate ? (
                      <div className="text-gray-600 dark:text-gray-200">
                        <span>
                          {`${formatInTimeZone(match.matchDate, TIME_ZONE, 'dd', { locale: es })}`}
                        </span>
                        <span>{' de '}</span>
                        <span className="capitalize">
                          {formatInTimeZone(match.matchDate, TIME_ZONE, 'LLLL', { locale: es })}
                        </span>
                        <span>{' del '}</span>
                        <span>
                          &nbsp;{formatInTimeZone(match.matchDate, TIME_ZONE, 'y', { locale: es })}
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-600">No definida</p>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {match.matchDate ? (
                      <div className="text-gray-600 dark:text-gray-200">
                        <p>
                          {formatInTimeZone(match.matchDate, TIME_ZONE, 'h:mm aaa', { locale: es })}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-600">No definida</p>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {match.place ? (
                      <p className="text-balance">{match.place}</p>
                    ) : (
                      <span className="text-gray-600">No definida</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/resultados/${match.id}/${match.local.permalink}-vs-${match.visitor.permalink}`}
                      className="font-semibold italic"
                      target="_blank"
                    >
                      <div className="grid grid-cols-[1fr_120px_1fr]">
                        <span className="text-right">
                          {
                            match.local.name.toLowerCase().includes('descanso')
                              ? <span className="text-gray-400 font-semibold italic">{match.local.name}</span>
                              : <span>{match.local.name}</span>
                          }
                        </span>
                        <span className="text-center flex justify-center items-center gap-2">
                          {match.penaltyShootout && (
                            <span className="text-gray-500 text-sm font-[400]">
                              ({match.penaltyShootout!.localGoals})
                            </span>
                          )}
                          <span className="text-xl text-sky-500 font-medium">
                            {match.localScore}
                          </span>
                          <span>-</span>
                          <span className="text-xl text-sky-500 font-medium">
                            {match.visitorScore}
                          </span>
                          {match.penaltyShootout && (
                            <span className="text-gray-500 text-sm font-[400]">
                              ({match.penaltyShootout!.visitorGoals})
                            </span>
                          )}
                        </span>
                        <span>
                          {
                            match.visitor.name.toLowerCase().includes('descanso')
                              ? (<span className="text-gray-400 font-semibold italic">{match.visitor.name}</span>)
                              : (<span>{match.visitor.name}</span>)
                          }
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={getMatchStatus(match.status as MATCH_STATUS_TYPE).variant}>
                      {getMatchStatus(match.status as MATCH_STATUS_TYPE).label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          href={`/resultados/${match.id}/${match.local.permalink}-vs-${match.visitor.permalink}`}
                          target="_blank"
                          className={buttonVariants({ variant: 'outline-info', size: 'icon-sm' })}
                        >
                          <Info />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        detalles del partido
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </>
  );
};
