import type { FC } from 'react';
import { fetchTournamentsAction } from '../(actions)/fetchTournamentsAction';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Tournament } from './tournament';
import "./styles.css";

export const TournamentsList: FC = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <>
      <ErrorHandler />
      <div className="tournaments">
        {tournaments.map((tournament) => (
          <Tournament
            key={tournament.id}
            tournament={tournament}
          />
        ))}
      </div>
    </>
  );
};



export default TournamentsList;
