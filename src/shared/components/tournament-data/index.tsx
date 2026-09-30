import type { FC } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type {
  TEAM_TYPE,
  TOURNAMENT_TYPE,
} from '@/app/admin/estadisticas/(actions)/fetch-standings.action';
import { ROUTES } from '../../constants/routes';
import { cn } from '@/lib/utils';
import { EmptyMessageResource } from '../empty-message-resource/index';
import { StandingsTeams } from './stanings-teams';
import styles from './styles.module.css';

type Props = Readonly<{
  tournament: TOURNAMENT_TYPE;
  teams: TEAM_TYPE[];
  standings: boolean;
  admin?: boolean;
}>;

export const TournamentData: FC<Props> = ({
  tournament,
  teams,
  standings = false,
  admin = false,
}) => {
  return (
    <>
      <section className={styles.tournamentData}>
        <div className={styles.column}>
          <Table className={styles.table}>
            <TableBody>
              <TableRow>
                <TableHead className={cn(styles.tableHead, 'w-25')}>Torneo</TableHead>
                <TableCell>
                  <Link
                    href={`${ROUTES.PUBLIC_TOURNAMENTS}/${tournament.id}`}
                    target="_blank"
                    className="font-semibold italic" rel="noreferrer"
                  >
                    {tournament?.name}
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className={cn(styles.tableHead, 'w-25')}>Fecha de Inicio</TableHead>
                <TableCell className={styles.tableCell}>
                  {format(tournament?.startDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className={cn(styles.tableHead, 'w-25')}>Fecha Final</TableHead>
                <TableCell className="text-gray-500">
                  {format(tournament.endDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className={styles.column}>
          <Table className={styles.table}>
            <TableBody>
              <TableRow>
                <TableHead className={cn(styles.tableHead, 'w-25')}>País</TableHead>
                <TableCell className={styles.tableCell}>{tournament.country}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className={cn(styles.tableHead, 'w-25')}>
                  Ciudad{(tournament.cities.length > 1) ? 'es' : ''}
                </TableHead>
                <TableCell className={styles.tableCell}>
                  {
                    (tournament.cities.length > 0)
                      ? (
                        <span className={styles.cities}>
                          {tournament.cities.join(', ')}
                        </span>
                      )
                      : (
                        <Badge variant="outline-secondary">
                          no definidas
                        </Badge>
                      )
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className={cn(styles.tableHead, 'w-25')}>
                  Temporada
                </TableHead>
                <TableCell className={styles.tableCell}>
                  {tournament?.season}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {teams.length === 0 && (
        <EmptyMessageResource>
          Este torneo aún no tiene equipos asignados
        </EmptyMessageResource>
      )}

      {!standings && (teams.length > 0) && (
        <StandingsTeams teams={teams} isAdmin={admin} />
      )}
    </>
  );
};
