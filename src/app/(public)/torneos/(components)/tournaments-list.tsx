import type { FC } from 'react';
import { fetchTournamentsAction } from '../(actions)/fetchTournamentsAction';
import Link from 'next/link';
import "./styles.css";

export const TournamentsList: FC = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <div className="tournaments">
      {tournaments.map((tournament) => (
        <section key={tournament.id} className="tournament">
          <h2 className="tournamentName">
            <Link href={`torneos/${tournament.permalink}`}>
              {tournament.name}
            </Link>
          </h2>
          <p>{tournament.imageUrl}</p>
          <div className="tournamentData">
            <p><b>División:</b> {tournament.division}</p>
            <p><b>Group:</b> {tournament.group}</p>
            <p><b>Temporada:</b> {tournament.season}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default TournamentsList;
