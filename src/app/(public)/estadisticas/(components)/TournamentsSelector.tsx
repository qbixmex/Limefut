import { fetchTournamentsAction } from "../(actions)/fetchTournamentsAction";
import SelectTournament from "./standings/select-tournament";

export const TournamentsSelector = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <SelectTournament tournaments={tournaments} />
  );
};

export default TournamentsSelector;
