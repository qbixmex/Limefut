import type { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { ROUTES } from '@/shared/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { formatInTimeZone } from 'date-fns-tz';
import { fetchPublicPlayoffMatchAction, type Match } from '../../(actions)/fetch-public-playoff-match';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { es } from 'date-fns/locale';
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from '@/shared/enums';
import { MatchStatus } from '../../../resultados/(components)/match-details/match-status';
import { ShieldBan } from 'lucide-react';
import { cn, getPlayoffRound } from '@/lib/utils';
import { PenaltyShootout } from '@/shared/components/penalty-shootouts';
import { WinnerTeam } from '../winner-team';
import { MatchGroup } from './match-group';
import styles from './styles.module.css';

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
      <section className={styles.mainWrapper} aria-label="Información del encuentro">
        <section className={styles.halfColumn} aria-label="Cancha del encuentro">
          <div className={styles.scoreboard} role="group" aria-label="Equipos y marcador del encuentro">
            <div className={cn(styles.team, styles.teamLocal)} role="group" aria-label="Equipo local">
              <Link
                href={
                  `${ROUTES.PUBLIC_TEAMS}/${local_team}` +
                  `?tournament=${tournament}` +
                  `&category=${category}`
                }
                target="_blank"
                rel="noreferrer"
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
                  className={styles.teamNameLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {match.local.name}
                </Link>
              </div>
            </div>

            <div className={cn(styles.team, styles.teamVisitor)} role="group" aria-label="Equipo visitante">
              <Link
                href={
                  `${ROUTES.PUBLIC_TEAMS}/${visitor_team}` +
                  `?tournament=${tournament}` +
                  `&category=${visitor_team}`
                }
                target="_blank"
                rel="noreferrer"
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
                  className={styles.teamNameLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {match.visitor.name}
                </Link>
              </div>
            </div>
            <div className={styles.matchResults}>
              <p role="status" aria-label="Marcador del encuentro">
                <span>{match.localScore}</span>
                <span>{match.visitorScore}</span>
              </p>
            </div>
            <span className={styles.fieldDivider} />
            <span className={styles.fieldDot} />
          </div>
        </section>

        <section className={styles.halfColumn} aria-label="Detalles del encuentro">
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
                    rel="noreferrer"
                  >
                    <p className={styles.balancedText}>{match.tournament.name}</p>
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
                  <MatchGroup group={match.group} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </section>

      <section className={styles.responsiveRow} aria-label="Fecha, hora y sede del encuentro">
        <div className={styles.halfColumn}>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableCell>
                  {match.matchDate ? (
                    <p className={styles.matchDate}>
                      <span>
                        {`${formatInTimeZone(match.matchDate, TIME_ZONE, 'dd', { locale: es })}`}
                      </span>
                      <span>{' de '}</span>
                      <span className={styles.capitalized}>
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
                  <span role="status" aria-label="Estado del encuentro">
                    <MatchStatus status={match?.status as MATCH_STATUS_TYPE} />
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className={styles.halfColumn}>
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

      <section aria-label="Comentarios adicionales">
        <h2 className={styles.remarksHeading}>Comentarios Adicionales</h2>

        <p>{
          match.remarks
            ? <span>{match.remarks}</span>
            : <span className={styles.mutedText}>Sin comentarios</span>
        }
        </p>
      </section>

      <section aria-label="Tanda de penales">
        {
          (
            (match?.status === MATCH_STATUS.COMPLETED) &&
            (match.localScore === match.visitorScore)
          ) && (
            <>
              <div className={styles.divider} />
              <h2 className={styles.penaltyHeading}>Tanda de Penales</h2>
              <section className={styles.responsiveRow}>
                <div className={styles.halfColumn}>
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
