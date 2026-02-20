'use client';

import { type FC, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DeleteMatch } from "../(components)/delete-match";
import { MATCH_STATUS } from "@/shared/enums";
import { MatchStatus } from "../(components)/match-status";
import { FinishMatch } from "../(components)/finish-match";
import { MatchScoreInput } from "../(components)/match-score-input";
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Match } from '../(actions)/fetchMatchesAction';
import { useSearchParams } from "next/navigation";
import { WeeksSelector } from './weeks-selector';
import { DateSelector } from './date-selector';
import { StatusSelector } from './status-selector';
import { formatInTimeZone } from 'date-fns-tz';
import { EditMatch } from './edit-match';

type Props = Readonly<{
  matches: Match[];
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
  const searchParams = useSearchParams();
  const [sortMatchDate, setSortMatchDate] = useState<'asc' | 'desc' | undefined>(undefined);
  const [sortWeek, setSortWeek] = useState<'asc' | 'desc' | undefined>(undefined);

  useEffect(() => {
    const urlSortMatchDate = searchParams.get('sortMatchDate') as 'asc' | 'desc' | null;
    const urlSortWeek = searchParams.get('sortWeek') as 'asc' | 'desc' | null;

    if (urlSortMatchDate !== sortMatchDate) {
      setSortMatchDate(urlSortMatchDate ?? undefined);
    }
    if (urlSortWeek !== sortWeek) {
      setSortWeek(urlSortWeek ?? undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow className="h-16">
                <TableHead className="w-full md:w-1/2">Encuentro</TableHead>
                <TableHead className="w-[100px] text-center">
                  <DateSelector />
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  <WeeksSelector weeks={matchesWeeks} />
                </TableHead>
                <TableHead
                  className="w-[120px]"
                  colSpan={2}
                >
                  <StatusSelector />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(matches.length > 0) && matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="w-25">
                    <div className="grid grid-cols-[1fr_120px_1fr] gap-2 font-semibold text-gray-500">
                      <div className="text-right">
                        <Link href={`/admin/equipos/${match.localTeam.permalink}`}>
                          {match.localTeam.name}
                        </Link>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        {match.status != MATCH_STATUS.COMPLETED ? (
                          <MatchScoreInput
                            matchId={match.id}
                            score={match.localScore}
                            local
                          />
                        ) : (
                          <Badge variant="outline">{match.localScore}</Badge>
                        )}
                        <Minus strokeWidth={2} />
                        {match.status != MATCH_STATUS.COMPLETED ? (
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
                        <Link href={`/admin/equipos/${match.localTeam.permalink}`}>
                          {match.visitorTeam.name}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {format(match.matchDate as Date, "dd / MMM / y", { locale: es }).toUpperCase()},
                    {' '}
                    {formatInTimeZone(match.matchDate as Date, 'America/Mexico_City', "h:mm a", { locale: es })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline-info">{match.week}</Badge>
                  </TableCell>
                  <TableCell>
                    {match.status === MATCH_STATUS.COMPLETED ? (
                      <div className="w-full max-w-[150px] border border-emerald-500 text-center rounded-lg py-2 px-4">
                        <span className="text-emerald-500 font-semibold">Finalizado</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
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
                        <TooltipTrigger asChild>
                          <Link href={`/admin/encuentros/detalles/${match.id}`}>
                            <Button variant="outline-info" size="icon">
                              <InfoIcon />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          detalles
                        </TooltipContent>
                      </Tooltip>
                      <EditMatch matchId={match.id} />
                      {match.status !== MATCH_STATUS.COMPLETED && (
                        <DeleteMatch id={match.id} roles={roles} />
                      )}
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
        <div className={cn("flex justify-center mt-10", {
          'hidden': matches.length === 0 || pagination!.totalPages === 1,
        })}>
          <Pagination totalPages={pagination!.totalPages as number} />
        </div>
      </div>
    </>
  );
};

export default MatchesTable;
