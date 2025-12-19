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
import {
  Pencil,
  InfoIcon,
  Minus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Props = Readonly<{
  matches: Match[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  roles: string[];
}>;

export const MatchesTable: FC<Props> = ({ matches, pagination, roles }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [sortMatchDate, setSortMatchDate] = useState<'asc' | 'desc' | undefined>(undefined);
  const [sortWeek, setSortWeek] = useState<'asc' | 'desc' | undefined>(undefined);

  const handleSort = (column: 'matchDate' | 'week') => {
    const params = new URLSearchParams(searchParams.toString());

    if (column === 'matchDate') {
      if (params.get('sortWeek')) {
        params.delete('sortWeek');
        setSortWeek(undefined);
      }
      const nextSort = (sortMatchDate === 'asc') ? 'desc' : 'asc';
      setSortMatchDate(nextSort);
      params.set('sortMatchDate', nextSort);
      router.replace(`${pathname}?${params}`);
    }

    if (column === 'week') {
      if (params.get('sortMatchDate')) {
        params.delete('sortMatchDate');
        setSortMatchDate(undefined);
      }
      const nextSort = (sortWeek === 'asc') ? 'desc' : 'asc';
      setSortWeek(nextSort);
      params.set('sortWeek', nextSort);
      router.replace(`${pathname}?${params}`);
    }
  };

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
      {matches && matches.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Encuentro</TableHead>
                  <TableHead className="w-[100px] text-center">
                    <button
                      type="button"
                      onClick={() => handleSort('matchDate')}
                      className="inline-flex items-center gap-1 font-semibold hover:text-sky-500"
                    >
                      <span>Fecha</span>
                      {sortMatchDate === 'asc' && <ChevronUp size={16} />}
                      {sortMatchDate === 'desc' && <ChevronDown size={16} />}
                    </button>
                  </TableHead>
                  <TableHead className="w-[100px] text-center">
                    <button
                      type="button"
                      onClick={() => handleSort('week')}
                      className="inline-flex items-center gap-1 font-semibold hover:text-sky-500"
                    >
                      <span>Semana</span>
                      {sortWeek === 'asc' && <ChevronUp size={16} />}
                      {sortWeek === 'desc' && <ChevronDown size={16} />}
                    </button>
                  </TableHead>
                  <TableHead className="w-[120px]">Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell className="grid grid-cols-[1fr_180px_1fr] gap-2 font-semibold text-gray-500">
                      <Link href={`/admin/equipos/${match.localTeam.permalink}`}>
                        {match.localTeam.name}
                      </Link>
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
                      <Link href={`/admin/equipos/${match.localTeam.permalink}`}>
                        {match.visitorTeam.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {format(match.matchDate as Date, "dd / MMM / y", { locale: es })}
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/encuentros/editar/${match.id}`}>
                              <Button variant="outline-warning" size="icon">
                                <Pencil />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            editar
                          </TooltipContent>
                        </Tooltip>
                        <DeleteMatch
                          id={match.id}
                          roles={roles}
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
            No hay encuentros
          </p>
        </div>
      )}
    </>
  );
};

export default MatchesTable;
