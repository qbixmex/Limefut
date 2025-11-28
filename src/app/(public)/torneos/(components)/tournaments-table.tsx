import type { FC } from 'react';
import { fetchTournamentsAction } from '../(actions)/fetchTournamentsAction';
import styles from "./styles.module.css";
import Link from 'next/link';

export const TournamentsTable: FC = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <div className={styles.wrapper}>
      {tournaments.map((tournament) => (
        <section key={tournament.id} className={styles.tournament}>
          <h2 className={styles.tournamentName}>
            <Link href={`#-${tournament.permalink}`}>
              {tournament.name}
            </Link>
          </h2>
          <p>{tournament.imageUrl}</p>
          <div className={styles.tournamentData}>
            <p><b>División:</b> {tournament.division}</p>
            <p><b>Group:</b> {tournament.group}</p>
            <p><b>Temporada:</b> {tournament.season}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default TournamentsTable;
