import type { FC } from "react";
import { auth } from "~/src/auth";
import { fetchMatchesAction } from "../(actions)";
import { MatchesTable } from "./matches-table";
import { fetchTournamentAction } from "../(actions)/fetchTournamentAction";

type Props = Readonly<{
  tournamentId: string;
  currentPage: number;
  query: string;
  sortMatchDate: 'asc' | 'desc' | undefined;
  sortWeek: 'asc' | 'desc';
}>;

export const MatchesWrapper: FC<Props> = async ({
  tournamentId,
  currentPage,
  query,
  sortMatchDate,
  sortWeek,
}) => {
  const session = await auth();

  const { tournament } = await fetchTournamentAction(
    tournamentId,
  );

  const { matches, pagination } = await fetchMatchesAction({
    tournamentId,
    page: currentPage,
    take: 12,
    searchTerm: query,
    sortMatchDate,
    sortWeek,
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