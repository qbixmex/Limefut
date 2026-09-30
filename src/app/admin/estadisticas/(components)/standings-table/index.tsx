import type { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import type { STANDING_TYPE } from '../../(actions)/fetch-standings.action';
import { ROUTES } from '@/shared/constants/routes';
import { StandingsAbbreviations } from './standings-abbreviations';
import styles from './styles.module.css';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  standings: STANDING_TYPE[];
}>;

export const StandingsTable: FC<Props> = ({ standings }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={cn(styles.tableHead)}>Posición</TableHead>
            <TableHead className={cn(styles.tableHead, 'text-left!')}>Equipo</TableHead>
            <TableHead className={styles.tableHead}>JJ</TableHead>
            <TableHead className={styles.tableHead}>JG</TableHead>
            <TableHead className={styles.tableHead}>JE</TableHead>
            <TableHead className={styles.tableHead}>JP</TableHead>
            <TableHead className={styles.tableHead}>GF</TableHead>
            <TableHead className={styles.tableHead}>GC</TableHead>
            <TableHead className={styles.tableHead}>DIF</TableHead>
            <TableHead className={styles.tableHead}>PTS</TableHead>
            <TableHead className={styles.tableHead}>PTA</TableHead>
            <TableHead className={styles.tableHead}>PTT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing, index) => (
            <TableRow key={standing.team.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className={cn(styles.tableCell, 'text-left!')}>
                <Link
                  href={ROUTES.ADMIN_TEAMS_SHOW(standing.team.id)}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.teamLink}
                >
                  {standing.team.name}
                </Link>
              </TableCell>
              <TableCell className={styles.tableCell}>{standing.matchesPlayed}</TableCell>
              <TableCell className={styles.tableCell}>{standing.wins}</TableCell>
              <TableCell className={styles.tableCell}>{standing.draws}</TableCell>
              <TableCell className={styles.tableCell}>{standing.losses}</TableCell>
              <TableCell className={styles.tableCell}>{standing.goalsFor}</TableCell>
              <TableCell className={styles.tableCell}>{standing.goalsAgainst}</TableCell>
              <TableCell className={styles.tableCell}>{standing.goalsDifference}</TableCell>
              <TableCell className={styles.tableCell}>{standing.points}</TableCell>
              <TableCell className={styles.tableCell}>{standing.additionalPoints}</TableCell>
              <TableCell className={styles.tableCell}>
                {standing.points + standing.additionalPoints}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <StandingsAbbreviations />
    </>
  );
};
