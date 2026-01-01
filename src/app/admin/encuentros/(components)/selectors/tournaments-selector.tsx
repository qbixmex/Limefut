import { type FC } from 'react';
import { fetchTournamentsAction } from '~/src/shared/actions/fetchTournamentsAction';
import { WeekSelector } from '../week-selector';
import { SelectTournament } from '~/src/shared/components/select-tournament';

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
