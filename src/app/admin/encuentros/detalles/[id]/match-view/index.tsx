import type { FC } from 'react';
import { redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { fetchMatchAction } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MATCH_STATUS } from '@/shared/enums';
import { getMatchStatus } from '@/app/admin/encuentros/(helpers)/place';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { PenaltyShootout } from '@/shared/components/penalty-shootouts';
import { MatchResults } from '@/shared/components/match-results';
import { FieldsMap } from '@/shared/components/fields-map';
import { resolveFieldMaps } from '@/lib/maps';
import { formatInTimeZone } from 'date-fns-tz';
import { ROUTES } from '@/shared/constants/routes';
import { EditMatch } from '../../../(components)/edit-match';
const TIME_ZONE = 'America/Mexico_City';
import { getMatchMode } from '@/lib/utils';
import styles from './styles.module.css';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const MatchView: FC<Props> = async ({ params }) => {
  const matchId = (await params).id;
  const response = await fetchMatchAction(matchId);

  if (!response.ok) {
    redirect(
      ROUTES.ADMIN_MATCHES +
      '?error=' +
      encodeURIComponent(response.message),
    );
  }

  const match = response.match as MATCH_TYPE;
  const matchField = match.field;
  const matchMaps = matchField ? await resolveFieldMaps([matchField]) : [];

  return (
    <>
      <section className="flex flex-col xl:flex-row gap-5">
        <div className="w-full xl:w-1/2">
          <MatchResults
            local={{
              name: match.localTeam.name,
              href: ROUTES.ADMIN_TEAMS_SHOW(match.localTeam.id),
              imageUrl: match.localTeam.imageUrl,
            }}
            visitor={{
              name: match.visitorTeam.name,
              href: ROUTES.ADMIN_TEAMS_SHOW(match.visitorTeam.id),
              imageUrl: match.visitorTeam.imageUrl,
            }}
            localScore={match.localScore}
            visitorScore={match.visitorScore}
          />
        </div>

        <div className="w-full xl:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead className={styles.tableHead}>Torneo</TableHead>
                <TableCell>
                  <Link
                    href={ROUTES.ADMIN_TOURNAMENTS_SHOW(match.tournament.id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {match.tournament.name}
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className={styles.tableHead}>Fecha del Encuentro</TableHead>
                <TableCell>
                  <span role="text" aria-label="Fecha del encuentro">
                    {
                      match.matchDate
                        ? format(match.matchDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
                        : <span className={styles.undefinedText}>No asignada</span>
                    }
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className={styles.tableHead}>Hora</TableHead>
                <TableCell>
                  <span role="text" aria-label="Hora del encuentro">
                    {
                      match.matchDate
                        ? formatInTimeZone(match.matchDate, TIME_ZONE, 'h:mm a', { locale: es })
                        : <span className={styles.undefinedText}>No asignada</span>
                    }
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Jornada</TableHead>
                <TableCell>
                  <span role="text" aria-label="Jornada del encuentro">
                    {match.week}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className={styles.tableHead}>Arbitro</TableHead>
                <TableCell>
                  <span role="text" aria-label="Arbitro del encuentro">
                    {match.referee ?? (
                      <span className={styles.undefinedText}>No definido</span>
                    )}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className={styles.tableHead}>Estado</TableHead>
                <TableCell>
                  <Badge
                    variant={getMatchStatus(match.status).variant}
                    className="uppercase"
                    role="status"
                    aria-label="Estado del encuentro"
                  >
                    {getMatchStatus(match.status).label}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className={styles.tableHead}>Modo</TableHead>
                <TableCell>
                  <Badge
                    variant={
                      match.mode === 'league'
                        ? 'outline-primary'
                        : 'outline-special'
                    }
                    className="uppercase"
                    role="status"
                    aria-label="Modo del encuentro"
                  >
                    {getMatchMode(match.mode)}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {matchMaps.length > 0 && (
        <FieldsMap maps={matchMaps} variant="admin" className="mt-10 mb-10" />
      )}

      {
        (
          (match.status === MATCH_STATUS.COMPLETED) &&
          (match.localScore === match.visitorScore)
        ) && (
          <>
            <h2 className={styles.penaltyShootsHeading}>Tanda de Penales</h2>

            <section className={styles.penaltyShoots}>
              <PenaltyShootout shootout={match.penaltyShootout} />
            </section>
          </>
        )
      }

      <div className={styles.editMatch}>
        <EditMatch matchId={match.id} />
      </div>
    </>
  );
};
