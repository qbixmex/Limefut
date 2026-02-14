import type { FC } from "react";
import { auth } from "@/lib/auth";
import { fetchMatchesAction, fetchTournamentForMatchAction } from "../(actions)";
import { MatchesTable } from "./matches-table";
import type { MATCH_STATUS_TYPE } from "@/shared/enums";
import { headers } from "next/headers";

type Props = Readonly<{
  tournamentId: string;
  currentPage: number;
  query: string;
  sortMatchDate: 'asc' | 'desc' | undefined;
  sortWeek: 'asc' | 'desc';
  status: MATCH_STATUS_TYPE;
}>;

export const MatchesWrapper: FC<Props> = async ({
  tournamentId,
  currentPage,
  query,
  sortMatchDate,
  sortWeek,
  status,
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const { tournament } = await fetchTournamentForMatchAction(tournamentId);

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