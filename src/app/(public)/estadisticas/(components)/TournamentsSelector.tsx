import SelectTournament from '@/app/admin/encuentros/(components)/selectors/select-tournament';
import { fetchTournamentsForSelectorAction } from '@/shared/actions/fetch-tournaments-for-selector.action';

export const TournamentsSelector = async () => {
  const { tournaments } = await fetchTournamentsForSelectorAction();

  return (
    <SelectTournament tournaments={tournaments} />
  );
};
