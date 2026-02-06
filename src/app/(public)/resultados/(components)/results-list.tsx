import type { FC } from 'react';
import { fetchResultsAction } from '../(actions)/fetchResultsAction';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SoccerField } from '@/shared/components/icons';
import { getMatchStatus } from '../(helpers)/status';
import type { MATCH_STATUS } from '@/shared/enums';
import { formatInTimeZone } from "date-fns-tz";
import { es } from 'date-fns/locale';

const TIME_ZONE = "America/Mexico_City";

type Props = Readonly<{
  tournament?: string;
  category?: string;
  format?: string;
}>;

export const ResultsList: FC<Props> = async ({
  tournament,
  category,
  format,
}) => {
  if (!tournament || !category || !format) {
    redirect(`/resultados?error=${encodeURIComponent('¡ El torneo, categoría y formato son obligatorios !')}`);
  }

  const { ok, message, matches } = await fetchResultsAction(tournament, category, format);

  if (!ok) {
    redirect(`/resultados?error=${encodeURIComponent(message)}`);
  }

  const matchesByWeek = matches.reduce((grouped, match) => {
    const week = match.week;
    if (week === null) return grouped;
    if (!grouped[week]) grouped[week] = [];
    grouped[week].push(match);
    return grouped;
  }, {} as Record<number, typeof matches>);

  const sortedWeeks = Object.keys(matchesByWeek)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <>
      {(matches.length === 0) && (
        <div className="flex-1 w-full flex flex-col gap-5 justify-center items-center border-2 border-blue-500 rounded">
          <SoccerField size={250} strokeWidth={1} className="text-emerald-600!" />
          <p className="text-sky-500 font-semibold text-2xl italic">
            Aún no hay encuentros programados
          </p>
        </div>
      )}
      {(matches.length > 0) && sortedWeeks.map((week) => (
        <div key={week} className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Jornada {week}</h3>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-center w-20">Categoría</TableHead>
                <TableHead className="text-center w-20">Formato</TableHead>
                <TableHead className="text-right">Equipo Local</TableHead>
                <TableHead>&nbsp;</TableHead>
                <TableHead className="text-left">Equipo Visitante</TableHead>
                <TableHead className="text-left">Estado</TableHead>
                <TableHead>&nbsp;</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchesByWeek[week].map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="text-gray-600 dark:text-gray-200">
                    {match.matchDate ? (
                      <>
                        <p>
                          <span>
                            {`${formatInTimeZone(match.matchDate, TIME_ZONE, 'dd', { locale: es })}`}
                          </span>
                          <span>{' de '}</span>
                          <span className="capitalize">
                            {formatInTimeZone(match.matchDate, TIME_ZONE, "LLLL", { locale: es })}
                          </span>
                          <span>{' del '}</span>
                          <span>
                            &nbsp;{formatInTimeZone(match.matchDate, TIME_ZONE, "y", { locale: es })}
                          </span>
                        </p>
                        <p>
                          {formatInTimeZone(match.matchDate, TIME_ZONE, "h:mm aaa", { locale: es })}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-600">No definida</p>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-200 text-center">
                    {match.tournament.category}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-200 text-center">
                    {match.tournament.format} vs {match.tournament.format}
                  </TableCell>
                  <TableCell className="text-right">
                    {
                      match.local.name.toLowerCase().includes('descanso')
                        ? (<span className="text-gray-400 font-semibold italic">{match.local.name}</span>)
                        : (
                          <Link
                            href={
                              `/equipos/${match.local.permalink}`
                              + `?torneo=${tournament}`
                              + `&categoria=${category}`
                              + `&formato=${format}`
                            }
                            target="_blank"
                            className="font-semibold italic"
                          >
                            {match.local.name}
                          </Link>
                        )
                    }
                  </TableCell>
                  <TableCell>
                    <div className="text-center flex justify-center items-center gap-2">
                      <span className="text-xl text-sky-500 font-medium">
                        {match.localScore}
                      </span>
                      <span>-</span>
                      <span className="text-xl text-sky-500 font-medium">
                        {match.visitorScore}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    {
                      match.visitor.name.toLowerCase().includes('descanso')
                        ? (<span className="text-gray-400 font-semibold italic">{match.visitor.name}</span>)
                        : (
                          <Link
                            href={
                              `/equipos/${match.visitor.permalink}`
                              + `?torneo=${tournament}`
                              + `&categoria=${category}`
                              + `&formato=${format}`
                            }
                            target="_blank"
                            className="font-semibold italic"
                          >
                            {match.visitor.name}
                          </Link>
                        )
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={getMatchStatus(match.status as MATCH_STATUS).variant}>
                      {getMatchStatus(match.status as MATCH_STATUS).label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={
                            `/resultados/${match.id}/${match.local.permalink}-vs-${match.visitor.permalink}`}
                          target="_blank"
                        >
                          <Button variant="outline-info" size="icon-sm">
                            <Info />
                          </Button>
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

export default ResultsList;
