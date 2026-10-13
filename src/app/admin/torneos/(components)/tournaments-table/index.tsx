import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { fetchTournamentsAction, updateTournamentStateAction } from '../../(actions)';
import { DeleteTournament } from '../delete-tournament';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { Badge } from '@/components/ui/badge';
import { ShowTournamentDetails } from '../show-tournament-details';
import { EditTournament } from '../edit-tournament';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ROUTES } from '@/shared/constants/routes';
import { EmptyMessageResource } from '@/shared/components/empty-message-resource';
import styles from './styles.module.css';

type Props = Readonly<{
  query: string;
  currentPage: string;
}>;

export const TournamentsTable: FC<Props> = async ({ query, currentPage }) => {
  const {
    ok,
    message,
    tournaments = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchTournamentsAction({
    page: Number(currentPage),
    take: 12,
    searchTerm: query,
  });

  if (!ok) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <>
      {tournaments && tournaments.length > 0 ? (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <Table aria-label="Tabla de datos">
              <TableHeader>
                <TableRow>
                  <TableHead className={styles.imageColumnHead}>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className={styles.seasonColumnHead}>Temporada</TableHead>
                  <TableHead className={styles.categoriesColumnHead}>Categorías</TableHead>
                  <TableHead className={styles.startDateColumnHead}>Fecha Inicial</TableHead>
                  <TableHead className={styles.endDateColumnHead}>Fecha Final</TableHead>
                  <TableHead className={styles.activeColumnHead}>Activo</TableHead>
                  <TableHead>&nbsp;</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className={styles.imageColumnCell}>
                      <Link
                        href={ROUTES.ADMIN_TOURNAMENTS_SHOW(tournament.id)}
                        aria-label={`Enlace a ${tournament.name}`}
                        data-testid={tournament.id}
                      >
                        {
                          !tournament.imageUrl ? (
                            <figure className={styles.placeholderFigure}>
                              <Trophy size={35} className={styles.placeholderIcon} />
                            </figure>
                          ) : (
                            <Image
                              src={tournament.imageUrl}
                              alt={`${tournament.name} picture`}
                              width={75}
                              height={75}
                              className={styles.tournamentImage}
                            />
                          )
                        }
                      </Link>
                    </TableCell>
                    <TableCell aria-label="Nombre del torneo">
                      {tournament.name}
                    </TableCell>
                    <TableCell className={styles.seasonColumnCell}>
                      {tournament.season}
                    </TableCell>
                    <TableCell className={styles.categoriesColumnCell}>
                      <Badge
                        variant={
                          (tournament.categoriesQuantity > 0)
                            ? 'outline-info'
                            : 'outline-secondary'
                        }
                        role="status"
                        aria-label={`${tournament.categoriesQuantity} categorías`}
                      >
                        {tournament.categoriesQuantity}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.startDateColumnCell}>
                      {format(tournament.startDate, "EEE d MMM',' y", { locale: es })}
                    </TableCell>
                    <TableCell className={styles.endDateColumnCell}>
                      {format(tournament.endDate, "EEE d MMM',' y", { locale: es })}
                    </TableCell>
                    <TableCell className={styles.activeColumnCell}>
                      <ActiveSwitch
                        resource={{
                          id: tournament.id,
                          state: tournament.active,
                        }}
                        updateResourceStateAction={updateTournamentStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className={styles.rowActions}>
                        <ShowTournamentDetails tournamentId={tournament.id} />
                        <EditTournament tournamentId={tournament.id } />
                        <DeleteTournament tournamentId={tournament.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div
            className={cn(styles.paginationWrapper, {
              [styles.paginationHidden]: pagination!.totalPages === 1,
            })}
          >
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <EmptyMessageResource>
          Aún no hay torneos creados
        </EmptyMessageResource>
      )}
    </>
  );
};
