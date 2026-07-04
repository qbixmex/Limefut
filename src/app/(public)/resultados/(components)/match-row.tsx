import type { FC } from 'react';
import Link from 'next/link';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { TableCell, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { getMatchStatus } from '@/app/(public)/resultados/(helpers)/status';
import type { MATCH_TYPE } from '@/app/(public)/resultados/(actions)/fetch-public-results.action';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/lib/utils';

const TIME_ZONE = 'America/Mexico_City';

type Props = Readonly<{
  match: MATCH_TYPE;
  roles: 'complete' | 'team' | 'field' | undefined;
  teamPermalink: string | undefined;
}>;

export const MatchRow: FC<Props> = ({ match, roles, teamPermalink }) => (
  <TableRow>
    <TableCell className="hidden lg:table-cell">
      {match.matchDate ? (
        <div className="text-gray-600 dark:text-gray-200">
          <span
            role="date"
            aria-label="Día del partido"
          >
            {`${formatInTimeZone(match.matchDate, TIME_ZONE, 'dd', { locale: es })}`}
          </span>
          <span>{' de '}</span>
          <span
            className="capitalize"
            role="date"
            aria-label="Mes del partido"
          >
            {formatInTimeZone(match.matchDate, TIME_ZONE, 'LLLL', { locale: es })}
          </span>
          <span>{' del '}</span>
          <span
            role="date"
            aria-label="Año del partido"
          >
            &nbsp;{formatInTimeZone(match.matchDate, TIME_ZONE, 'y', { locale: es })}
          </span>
        </div>
      ) : (
        <span
          role="date"
          aria-label="Fecha del partido no definida"
          className="text-gray-600"
        >No definida</span>
      )}
    </TableCell>
    <TableCell className="hidden lg:table-cell">
      {match.matchDate ? (
        <div className="text-gray-600 dark:text-gray-200">
          <span role="time" aria-label="Hora del partido">
            {formatInTimeZone(match.matchDate, TIME_ZONE, 'h:mm aaa', { locale: es })}
          </span>
        </div>
      ) : (
        <span
          className="text-gray-600"
          role="time"
          aria-label="Hora del partido no definida"
        >No definida</span>
      )}
    </TableCell>
    <TableCell className="hidden lg:table-cell">
      {match.place ? (
        <p
          className="text-balance"
          role="location"
          aria-label="Sede del partido"
        >{match.place}</p>
      ) : (
        <span
          className="text-gray-600"
          role="location"
          aria-label="Sede del partido no definida"
        >No definida</span>
      )}
    </TableCell>
    <TableCell>
      <div className="grid grid-cols-[1fr_120px_1fr]">
        <span
          className="text-right"
          role="team-name"
          aria-label="Nombre equipo local"
        >
          <Link
            href={ROUTES.PUBLIC_TEAMS_SHOW(match.local.permalink) +
              `?tournament=${match.tournament.permalink}` +
              `&category=${match.category?.permalink}`
            }
            className="text-blue-500 dark:text-blue-400"
            target='_blank'
          >
            {
              match.local.name.toLowerCase().includes('descanso')
                ? <span className="text-gray-400 font-semibold italic">{match.local.name}</span>
                : <span className={cn({
                  'text-lg font-semibold': roles === 'team' && teamPermalink === match.local.permalink,
                })}>{match.local.name}</span>
            }
          </Link>
        </span>
        <span className="text-center flex justify-center items-center gap-2">
          {match.penaltyShootout && (
            <span
              className="text-gray-500 text-sm font-[400]"
              role="score"
              aria-label={'Penales equipo local'}
            >
              ({match.penaltyShootout!.localGoals})
            </span>
          )}
          <span
            className="text-xl text-sky-500 font-medium"
            role="score"
            aria-label={'Goles equipo local'}
          >
            {match.localScore}
          </span>
          <span>-</span>
          <span
            className="text-xl text-sky-500 font-medium"
            role="score"
            aria-label={'Goles equipo visitante'}
          >
            {match.visitorScore}
          </span>
          {match.penaltyShootout && (
            <span
              className="text-gray-500 text-sm font-[400]"
              role="score"
              aria-label={'Penales equipo visitante'}
            >
              ({match.penaltyShootout!.visitorGoals})
            </span>
          )}
        </span>
        <span
          role="team-name"
          aria-label="Nombre equipo visitante"
        >
          <Link
            href={ROUTES.PUBLIC_TEAMS +
              `/${match.visitor.permalink}` +
              `?tournament=${match.tournament.permalink}` +
              `&category=${match.category?.permalink}`
            }
            className="text-blue-500 dark:text-blue-400"
          >
            {
              match.visitor.name.toLowerCase().includes('descanso')
                ? (<span className="text-gray-400 font-semibold italic">{match.visitor.name}</span>)
                : (<span className={cn({
                  'text-lg font-semibold': roles === 'team' && teamPermalink === match.visitor.permalink,
                })}>{match.visitor.name}</span>)
            }
          </Link>
        </span>
      </div>
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <Badge
        variant={getMatchStatus(match.status as MATCH_STATUS_TYPE).variant}
        role="status"
        aria-label={`Estado del partido: ${getMatchStatus(match.status as MATCH_STATUS_TYPE).label}`}
      >
        {getMatchStatus(match.status as MATCH_STATUS_TYPE).label}
      </Badge>
    </TableCell>
    <TableCell className="hidden lg:table-cell">
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={`${ROUTES.PUBLIC_RESULTS}/${match.id}`}
            target="_blank"
            className={buttonVariants({ variant: 'outline-info', size: 'icon-sm' })}
            role="button"
            aria-label={`Detalles del partido entre ${match.local.name} y ${match.visitor.name}`}
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
);
