import { type FC } from "react";

import { StandingsTable } from "./standings-table";
import { SelectTournament } from "./select-tournament";
import { fetchTournamentsAction } from "../../(actions)/fetchTournamentsAction";
import { fetchStandingsAction } from '../../(actions)/fetchStandingsAction';

type Props = Readonly<{
  paramsPromise: Promise<{ tournamentPermalink: string; }>;
}>;

export const Standings: FC<Props> = async ({ paramsPromise }) => {
  const { tournaments } = await fetchTournamentsAction();
  const { tournamentPermalink } = await paramsPromise;
  const { standings } = await fetchStandingsAction(tournamentPermalink);

  return (
    <>
      <SelectTournament tournaments={tournaments} />
      {tournamentPermalink && (
        <StandingsTable standings={standings} />
      )}
    </>
  );
};

export default Standings;
