import { fetchTournamentsAction } from "../../(actions)";
import { SelectorInputs } from "./selector";

const TournamentsSelector = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <SelectorInputs tournaments={tournaments} />
  );
};

export default TournamentsSelector;
