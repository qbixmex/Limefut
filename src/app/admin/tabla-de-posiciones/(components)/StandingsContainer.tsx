'use client';

import { Suspense, useState, type FC } from 'react';
import { TournamentSelector } from './TournamentSelector';
import { Standings } from './Standings';
import { SkeletonTable } from './SkeletonTable';
import { fetchStandingsAction, type StandingPromise } from '../(actions)/fetchStandingsAction';

type Props = {
  tournaments: {
    id: string;
    name: string;
  }[];
};

export const StandingsContainer: FC<Props> = ({ tournaments }) => {
  const [standingsPromise, setStandingsPromise] = useState<StandingPromise | null>(null);

  const handleSelect = (tournamentId: string) => {
    if (tournamentId) {
      const standingsPromise = fetchStandingsAction(tournamentId);
      setStandingsPromise(standingsPromise);
    } else {
      setStandingsPromise(null);
    }
  };

  return (
    <div>
      <TournamentSelector 
        tournaments={tournaments} 
        onSelect={handleSelect} 
      />
      {standingsPromise && (
        <Suspense fallback={<SkeletonTable />}>
          <Standings
            standingsPromise={standingsPromise}
            onCreatedStandings={handleSelect}
          />
        </Suspense>
      )}
    </div>
  );
};

export default StandingsContainer;
