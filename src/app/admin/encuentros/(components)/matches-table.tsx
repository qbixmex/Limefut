import type { FC } from 'react';
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DeleteMatch } from "../(components)/delete-match";
import { MATCH_STATUS } from "@/shared/enums";
import { MatchStatus } from "../(components)/match-status";
import { FinishMatch } from "../(components)/finish-match";
import { MatchScoreInput } from "../(components)/match-score-input";
import { fetchMatchesAction } from '../(actions)';
import { auth } from '@/auth.config';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  query: string;
  currentPage: number;
}>;

export const MatchesTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await auth();
  const {
    matches = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchMatchesAction({
    page: currentPage,
    take: 8,
    searchTerm: query,
  });

  return (
    <>
      {matches && matches.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Encuentro</TableHead>
                  <TableHead className="w-[100px] text-center">Jornada</TableHead>
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
                            <p>editar</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteMatch
                          id={match.id}
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
            No hay encuentros
          </p>
        </div>
      )}
    </>
  );

};

export default MatchesTable;
