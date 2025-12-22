import { type FC } from 'react';
import { fetchTournamentsAction } from '~/src/shared/actions/fetchTournamentsAction';
import { SelectTournament } from '~/src/app/(public)/equipos/(components)/select-tournament';
import { WeekSelector } from '../week-selector';

export const TournamentsSelector: FC = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <div className="flex gap-5">
      <SelectTournament tournaments={tournaments} />
      <WeekSelector />
    </div>
  );

};

export default TournamentsSelector;
