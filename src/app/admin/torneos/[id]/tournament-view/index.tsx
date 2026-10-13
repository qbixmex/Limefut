import type { FC } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Table, TableBody, TableHead, TableCell, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fetchTournamentAction, type TOURNAMENT_TYPE } from '../../(actions)';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DeleteTournamentImage } from '../../(components)/delete-tournament-image';
import { ROUTES } from '@/shared/constants/routes';
import styles from './styles.module.css';

type Props = Readonly<{
  paramsPromise: Promise<{
    id: string;
  }>;
}>;

export const TournamentView: FC<Props> = async ({ paramsPromise }) => {
  const tournamentId = (await paramsPromise).id;
  const response = await fetchTournamentAction(tournamentId);

  if (!response.ok) {
    redirect(
      ROUTES.ADMIN_TOURNAMENTS +
      '?error=' +
      encodeURIComponent(response.message),
    );
  }

  const tournament = response.tournament as TOURNAMENT_TYPE;

  return (
    <div data-testid="tournament-details">
      <section className={styles.detailsSection}>
        <div className={styles.imageColumn}>
          {
            !tournament.imageUrl ? (
              <div
                data-testid="tournament-image-placeholder"
                className={styles.imagePlaceholder}
              >
                <Trophy
                  size={512}
                  strokeWidth={1}
                  className={styles.placeholderIcon}
                  aria-hidden="true"
                />
              </div>
            ) : (
              <div className={styles.imageWrapper}>
                <div className={styles.imageFrame}>
                  <Image
                    src={tournament.imageUrl}
                    width={512}
                    height={512}
                    alt={tournament.name}
                    className={styles.image}
                    aria-label="Imagen del torneo"
                  />
                  <DeleteTournamentImage
                    teamId={tournament.id}
                    className={styles.imageActions}
                  />
                </div>
              </div>
            )
          }
        </div>

        <div className={styles.infoColumn}>
          <div className={styles.infoTableWrapper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className={styles.sizedLabelHead}>Nombre</TableHead>
                  <TableCell>
                    <p className={styles.wrappedText}>{tournament.name}</p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className={styles.labelHead}>
                    <p className={styles.wrappedText}>Enlace Permanente</p>
                  </TableHead>
                  <TableCell>
                    <p className={styles.permalink}>{tournament.permalink}</p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className={styles.sizedLabelHead}>País</TableHead>
                  <TableCell>
                    <span role="text" aria-label="País del torneo">
                      {tournament.country ?? 'No disponible'}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className={styles.labelHead}>Temporada</TableHead>
                  <TableCell>
                    <span role="text" aria-label="Temporada del torneo">
                      {tournament.season ?? 'No disponible'}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className={styles.labelHead}>
                    Ciudades
                  </TableHead>
                  <TableCell>
                    <p
                      className={styles.wrappedText}
                      role="text"
                      aria-label="Ciudades del torneo"
                    >
                      {
                        (tournament.cities.length > 0)
                          ? tournament.cities.join(', ')
                          : 'No disponibles'
                      }
                    </p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className={styles.labelHead}>
                    <p className={styles.wrappedText}>Fecha Inicial</p>
                  </TableHead>
                  <TableCell>
                    <span
                      className={styles.prettyText}
                      role="text"
                      aria-label="Fecha inicial"
                    >
                      {format(new Date(tournament.startDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className={styles.labelHead}>Fecha Final</TableHead>
                  <TableCell>
                    <span
                      className={styles.prettyText}
                      role="text"
                      aria-label="Fecha final"
                    >
                      {format(new Date(tournament.endDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className={styles.labelHeadMedium}>Activo</TableHead>
                  <TableCell>
                    {
                      tournament.active
                        ? (
                          <Badge
                            variant="outline-info"
                            role="status"
                            aria-label="Torneo activo"
                          >
                            activo
                          </Badge>
                        )
                        : (
                          <Badge
                            variant="outline-secondary"
                            role="status"
                            aria-label="Torneo desactivado"
                          >
                            desactivado
                          </Badge>
                        )
                    }
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <p className={`${styles.sectionTitle} ${styles.descriptionTitle}`}>Descripción</p>
        {tournament.description ? (
          <p
            className={styles.prettyText}
            aria-label="Descripción del torneo"
          >
            {tournament.description}
          </p>
        ) : (
          <Badge
            variant="outline-secondary"
            role="status"
            aria-label="Descripción del torneo"
          >
            No suministrada
          </Badge>
        )}
      </section>

      <section className={styles.contentSection}>
        <h2 className={`${styles.sectionTitle} ${styles.categoriesTitle}`}>
          Categorías{' '}
          <span
            className={styles.categoryCount}
          >
            ({tournament.categories.length})
          </span>
        </h2>

        <div className={styles.categoriesList}>
          {(tournament.categories.length > 0) && (
            tournament.categories.map((category) => (
              <Badge
                key={category.id}
                variant="outline-info"
                role="status"
                aria-label={category.name}
              >
                {category.name}
              </Badge>
            ))
          )}

          {(tournament.categories.length === 0) && (
            <Badge
              variant="outline-secondary"
              role="status"
              aria-label="Sin categorías"
            >
              No disponibles
            </Badge>
          )}
        </div>
      </section>
    </div>
  );
};
