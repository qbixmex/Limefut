import { fetchTournamentsAction } from '../../(actions)';
import { RoleTypeSelector } from '../roles';
import { SelectorInputs } from './selector';

const TournamentsSelector = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <div>
      <RoleTypeSelector />
      {
        false && (
          <SelectorInputs tournaments={tournaments} />
        )
      }
    </div>
  );
};

export default TournamentsSelector;
