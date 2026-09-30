import type { FC } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/shared/constants/routes';
import styles from './styles.module.css';

type Props = Readonly<{
  teams: {
    id: string;
    name: string;
    permalink: string;
  }[];
  isAdmin?: boolean;
}>;

export const StandingsTeams: FC<Props> = ({ teams, isAdmin = false }) => {
  return (
    <div className={styles.standingsTeams}>
      <h2 className={styles.title}>Equipos Asignados</h2>
      <div className={styles.teamsContainer}>
        {teams.map(({ id, name, permalink }) => (
          <Link
            key={id}
            href={
              isAdmin
                ? ROUTES.ADMIN_TEAMS_SHOW(id)
                : ROUTES.PUBLIC_TEAMS_SHOW(permalink)
            }
            target="_blank"
            rel="noreferrer"
          >
            <Badge variant="outline-info">{name}</Badge>
          </Link>
        ))}
      </div>
    </div>
  );
};
