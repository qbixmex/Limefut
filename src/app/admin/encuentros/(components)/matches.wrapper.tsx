import type { FC } from "react";
import { auth } from "~/src/auth";
import { fetchMatchesAction } from "../(actions)";
import { MatchesTable } from "./matches-table";
import { fetchTournamentAction } from "../(actions)/fetchTournamentAction";
import type { MATCH_STATUS } from "~/src/shared/enums";

type Props = Readonly<{
  tournamentId: string;
  currentPage: number;
  query: string;
  sortMatchDate: 'asc' | 'desc' | undefined;
  sortWeek: 'asc' | 'desc';
  status: MATCH_STATUS;
}>;

export const MatchesWrapper: FC<Props> = async ({
  tournamentId,
  currentPage,
  query,
  sortMatchDate,
  sortWeek,
  status,
}) => {
  const session = await auth();

  const { tournament } = await fetchTournamentAction(tournamentId);

  const { matches, pagination } = await fetchMatchesAction({
    tournamentId,
    page: currentPage,
    take: 12,
    searchTerm: query,
    sortMatchDate,
    sortWeek,
    status,
  });

  return (
    <MatchesTable
      matchesWeeks={tournament!.weeks}
      matches={matches}
      pagination={pagination}
      roles={session?.user.roles as string[]}
    />
  );
};

export default MatchesWrapper;