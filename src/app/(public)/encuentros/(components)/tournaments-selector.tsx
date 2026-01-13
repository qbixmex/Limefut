import { fetchTournamentsAction } from "../../(actions)";
import { SelectTournament } from "../../components/tournaments/select-tournament";

const TournamentsSelector = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <SelectTournament tournaments={tournaments} />
  );
};

export default TournamentsSelector;
