import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchTeamsAction } from '../../(actions)/fetchTeamsAction';
import { ShieldBan } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import styles from './style.module.css';

type TeamsListProps = Readonly<{
  tournamentPermalink?: string;
  category?: string;
}>;

export const TeamsList: FC<TeamsListProps> = async ({
  tournamentPermalink,
  category,
}) => {
  if (!tournamentPermalink || !category) {
    return null;
  }

  const { teams } = await fetchTeamsAction(tournamentPermalink, category);

  if (teams.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        <p>Aún no hay equipos para este torneo</p>
      </div>
    );
  }

  return (
    <div className={styles.teamsGrid}>
      {teams.map((team) => (
        <div key={team.id} className={styles.teamCard}>
          <div className={styles.imageContainer}>
            {!team.imageUrl ? (
              <div className={styles.imagePlaceholder}>
                <Link
                  href={
                    ROUTES.PUBLIC_TEAMS +
                    `/${team.permalink}` +
                    `?tournament=${tournamentPermalink}` +
                    `&category=${team.category}`
                  }
                >
                  <ShieldBan strokeWidth={1} className={styles.imagePlaceholderIcon} />
                </Link>
              </div>
            ) : (
              <Link
                href={
                  ROUTES.PUBLIC_TEAMS +
                  `/${team.permalink}` +
                  `?tournament=${tournamentPermalink}` +
                  `&category=${team.category?.permalink}`
                }
                title={`Ver detalles de ${team.name.toLowerCase()}`}
              >
                <Image
                  src={team.imageUrl as string}
                  width={100}
                  height={100}
                  alt={`Equipo ${team.name}`}
                  className={styles.teamImage}
                />
              </Link>
            )}
          </div>
          <div className={styles.teamCardContent}>
            <p className={styles.teamName}>{team.name}</p>
            <Link
              href={
                ROUTES.PUBLIC_TEAMS +
                `/${team.permalink}` +
                `?tournament=${tournamentPermalink}` +
                `&category=${team.category?.permalink}`
              }
              className={styles.detailsLink}
            >
              ver detalles
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
