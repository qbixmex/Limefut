import { TournamentsSelector } from '../../(components)/tournaments-selector';
import { fetchTournamentsAction } from '@/shared/actions/fetchTournamentsAction';

export const SearchParamsSelectors = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <TournamentsSelector tournaments={tournaments} />
  );
};
