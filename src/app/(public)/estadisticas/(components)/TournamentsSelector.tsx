import { fetchTournamentsAction } from "~/src/shared/actions/fetchTournamentsAction";
import { SelectTournament } from "~/src/shared/components/select-tournament";

export const TournamentsSelector = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <SelectTournament tournaments={tournaments} />
  );
};

export default TournamentsSelector;
