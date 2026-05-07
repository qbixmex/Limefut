import SelectTournament from '@/app/admin/encuentros/(components)/selectors/select-tournament';
import { fetchTournamentsAction } from '~/src/shared/actions/fetchTournamentsAction';

export const TournamentsSelector = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <SelectTournament tournaments={tournaments} />
  );
};

export default TournamentsSelector;
