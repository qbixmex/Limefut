import type { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { ROUTES } from '@/shared/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { formatInTimeZone } from 'date-fns-tz';
import { fetchPublicPlayoffMatchAction, type Match } from '../(actions)/fetch-public-playoff-match';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { es } from 'date-fns/locale';
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from '@/shared/enums';
import { MatchStatus } from '../../resultados/(components)/match-details/match-status';
import { ShieldBan } from 'lucide-react';
import styles from './styles.module.css';
import { cn, getPlayoffRound } from '@/lib/utils';
import { PenaltyShootout } from '@/shared/components/penalty-shootouts';
import { WinnerTeam } from './winner-team';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    local_team?: string;
    visitor_team?: string;
  }>;
}>;

const TIME_ZONE = 'America/Mexico_City';

export const MatchView: FC<Props> = async ({ searchParams }) => {
  const {
    tournament,
    category,
    local_team,
    visitor_team,
  } = await searchParams;

  const response = await fetchPublicPlayoffMatchAction({
    tournamentPermalink: tournament,
    categoryPermalink: category,
    localTeamPermalink: local_team,
    visitorTeamPermalink: visitor_team,
  });

  if (!response.ok) {
    redirect(`/liguilla?error=${encodeURIComponent(response.message)}`);
  }

  const match = response.match as Match;

  return (
    <>
      <section className={styles.mainWrapper}>
        <section className="w-full lg:w-1/2">
          <div className="flex relative">
            <div className={cn(styles.team, styles.teamLocal)}>
              <Link
                href={
                  `${ROUTES.PUBLIC_TEAMS}/${local_team}` +
                  `?tournament=${tournament}` +
                  `&category=${category}`
                }
                target="_blank"
              >
                {!match.local.imageUrl ? (
                  <div className={styles.shieldIconWrapper}>
                    <ShieldBan
                      size={90}
                      className={styles.shieldIcon}
                      strokeWidth={1.5}
                    />
                  </div>
                ) : (
                  <Image
                    src={match.local.imageUrl}
                    width={100}
                    height={100}
                    alt={`${match.local.name} equipo`}
                    className={styles.teamShield}
                  />
                )}
              </Link>
              <div className={styles.teamName}>
                <Link
                  href={
                    `${ROUTES.PUBLIC_TEAMS}/${local_team}` +
                    `?tournament=${tournament}` +
                    `&category=${local_team}`
                  }
                  className="text-gray-100"
                  target="_blank"
                >
                  {match.local.name}
                </Link>
              </div>
            </div>

            <div className={cn(styles.team, styles.teamVisitor)}>
              <Link
                href={
                  `${ROUTES.PUBLIC_TEAMS}/${visitor_team}` +
                  `?tournament=${tournament}` +
                  `&category=${visitor_team}`
                }
                target="_blank"
              >
                {!match.visitor.imageUrl ? (
                  <div className={styles.shieldIconWrapper}>
                    <ShieldBan
                      size={90}
                      className={styles.shieldIcon}
                      strokeWidth={1.5}
                    />
                  </div>
                ) : (
                  <Image
                    src={match.visitor.imageUrl}
                    width={100}
                    height={100}
                    alt={`${match.visitor.name} equipo`}
                    className={styles.teamShield}
                  />
                )}
              </Link>
              <div className={styles.teamName}>
                <Link
                  href={
                    `${ROUTES.PUBLIC_TEAMS}/${visitor_team}` +
                    `?tournament=${tournament}` +
                    `&category=${category}`
                  }
                  className="text-gray-100"
                  target="_blank"
                >
                  {match.visitor.name}
                </Link>
              </div>
            </div>
            <div className={styles.matchResults}>
              <p>
                <span>{match.localScore}</span>
                <span>{match.visitorScore}</span>
              </p>
            </div>
            <span className={styles.fieldDivider} />
            <span className={styles.fieldDot} />
          </div>
        </section>

        <section className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Torneo</TableHead>
                <TableCell>
                  <Link
                    href={
                      ROUTES.PUBLIC_TOURNAMENT_SHOW(match.tournament.permalink) +
                      `?category=${category}`
                    }
                    target="_blank"
                  >
                    <p className='text-balance'>{match.tournament.name}</p>
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableCell>
                  {
                    match.category
                      ? <Badge variant="outline-info">{match.category.name}</Badge>
                      : <Badge variant="outline-secondary">no disponible</Badge>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Ronda</TableHead>
                <TableCell>
                  <Badge variant="outline-info">
                    {getPlayoffRound(match.round)}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>
                  Ganador del<br />encuentro
                </TableHead>
                <TableCell>
                  <WinnerTeam
                    winnerTeamName={match.winner?.name}
                    matchStatus={match.status as MATCH_STATUS_TYPE}
                    localScore={match.localScore ?? 0}
                    visitorScore={match.visitorScore ?? 0}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Grupo</TableHead>
                <TableCell>
                  {(match.group === 'golder')
                    ? (
                      <Badge
                        variant="outline-warning"
                        className="text-amber-500 border-amber-500"
                      >oro</Badge>
                    )
                    : (match.group === 'silvered')
                      ? (
                        <Badge
                          variant="outline-warning"
                          className="text-zinc-500 border-zinc-500 dark:text-zinc-400 dark:border-zinc-400"
                        >plata</Badge>
                      )
                      : (
                        <Badge
                          variant="outline-info"
                        >general</Badge>
                      )
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </section>

      <section className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableCell>
                  {match.matchDate ? (
                    <p className="dark:text-gray-200">
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
                    </p>
                  ) : (
                    <Badge variant="outline-secondary">no disponible</Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableCell>
                  {match.matchDate ? (
                    formatInTimeZone(match.matchDate, TIME_ZONE, 'h:mm aaa', { locale: es })
                  ) : (
                    <Badge variant="outline-secondary">no disponible</Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableCell>
                  <MatchStatus status={match?.status as MATCH_STATUS_TYPE} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Sede</TableHead>
                <TableCell>
                  {
                    match.field
                      ? <Badge variant="outline-info">{match.field.name}</Badge>
                      : <Badge variant="outline-secondary">no disponible</Badge>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Arbitro</TableHead>
                <TableCell>{match?.referee ?? 'No especificado'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="text-xl text-sky-500 mb-2">Comentarios Adicionales</h2>

        <p>{
          match.remarks
            ? <span>match.remarks</span>
            : <span className="text-gray-500">Sin comentarios</span>
        }</p>
      </section>

      <section>
        {
          (
            (match?.status === MATCH_STATUS.COMPLETED) &&
            (match.localScore === match.visitorScore)
          ) && (
            <>
              <div className="w-full h-0.25 bg-gray-600 my-5"></div>
              <h2 className="text-lg font-bold text-sky-500 mb-5">Tanda de Penales</h2>
              <section className="flex flex-col lg:flex-row gap-5">
                <div className="w-full lg:w-1/2">
                  <PenaltyShootout shootout={match.penaltyShootout} />
                </div>
              </section>
            </>
          )
        }
      </section>
    </>
  );
};
