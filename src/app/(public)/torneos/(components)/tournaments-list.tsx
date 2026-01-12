'use client';

import { type FC, useRef } from 'react';
import type { TournamentType } from '../(actions)/fetchTournamentsAction';
import { Tournament } from './tournament';
import { useGrabScroll } from '@/shared/hooks/use-grab-scroll';

type Props = Readonly<{
  tournaments: TournamentType[];
}>;

export const TournamentsList: FC<Props> = ({ tournaments }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useGrabScroll(scrollRef);

  return (
    <div className="tournaments" ref={scrollRef}>
      {tournaments.map((tournament) => (
        <div key={tournament.id}>
          <Tournament
            key={tournament.id}
            tournament={tournament}
          />
        </div>
      ))}
    </div>
  );

};

export default TournamentsList;
