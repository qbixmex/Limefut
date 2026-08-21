import type { FC } from 'react';
import { redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { fetchMatchAction } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TbSoccerField } from 'react-icons/tb';
import { MATCH_STATUS } from '@/shared/enums';
import { getMatchStatus } from '@/app/admin/encuentros/(helpers)/place';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { PenaltyShootout } from '@/shared/components/penalty-shootouts';
import { formatInTimeZone } from 'date-fns-tz';
import { ROUTES } from '@/shared/constants/routes';
import { EditMatch } from '../../../(components)/edit-match';
const TIME_ZONE = 'America/Mexico_City';
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
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(response.message)}`);
  }

  const match = response.match as MATCH_TYPE;

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.imageContainer}>
          <TbSoccerField size={480} strokeWidth={1} className={styles.imageIcon} />
        </div>

        <Table>
          <TableBody>
            <TableRow>
              <TableHead className={styles.tableHead}>Encuentro</TableHead>
              <TableCell className={styles.tableCellResults}>
                <Link
                  href={ROUTES.ADMIN_TEAMS_SHOW(match.localTeam.id)}
                  className={styles.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {match.localTeam.name}
                </Link>
                <Badge
                  variant="outline-info"
                  role="status"
                  aria-label="Anotaciones del equipo local"
                >
                  {match.localScore}
                </Badge>
                <Minus strokeWidth={2} />
                <Badge
                  variant="outline-info"
                  role="status"
                  aria-label="Anotaciones del equipo visitante"
                >
                  {match.visitorScore}
                </Badge>
                <Link
                  href={ROUTES.ADMIN_TEAMS_SHOW(match.visitorTeam.id)}
                  className={styles.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {match.visitorTeam.name}
                </Link>
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
              <TableHead className={styles.tableHead}>Sede</TableHead>
              <TableCell>
                <span role="text" aria-label="Sede del encuentro">
                  {match.field?.name ?? (
                    <span className={styles.undefinedText}>No definida</span>
                  )}
                </span>
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
              <TableHead className={styles.tableHead}>Estado</TableHead>
              <TableCell>
                <Badge
                  variant={getMatchStatus(match.status).variant}
                  role="status"
                  aria-label="Estado del encuentro"
                >
                  {getMatchStatus(match.status).label}
                </Badge>
              </TableCell>
            </TableRow>
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
              <TableHead className={styles.tableHead}>Fecha de creación</TableHead>
              <TableCell>
                <span role="text" aria-label="Fecha de creación del encuentro">
                  {format(new Date(match.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {(
        (match.status === MATCH_STATUS.COMPLETED) &&
        (match.localScore === match.visitorScore)
      ) && (
        <>
          <h2 className={styles.penaltyShootsHeading}>Tanda de Penales</h2>

          <section className={styles.penaltyShoots}>
            <PenaltyShootout shootout={match.penaltyShootout} />
          </section>
        </>
      )}

      <div className={styles.editMatch}>
        <EditMatch matchId={match.id} />
      </div>
    </>
  );
};
