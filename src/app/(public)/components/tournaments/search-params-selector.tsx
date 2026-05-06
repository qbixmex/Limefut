import { fetchTournamentsAction } from '../../(actions)';
import { SelectorInputs } from './selector';

export const SearchParamsSelector = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return <SelectorInputs tournaments={tournaments} />;
};
