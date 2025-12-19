import type { FC } from "react";
import { auth } from "~/src/auth";
import { fetchMatchesAction } from "../(actions)";
import { MatchesTable } from "./matches-table";

type Props = Readonly<{
  currentPage: number;
  query: string;
  sortMatchDate: 'asc' | 'desc' | undefined;
  sortWeek: 'asc' | 'desc';
}>;

export const MatchesWrapper: FC<Props> = async ({
  currentPage,
  query,
  sortMatchDate,
  sortWeek,
}) => {
  const session = await auth();

  const { matches, pagination } = await fetchMatchesAction({
    page: currentPage,
    take: 12,
    searchTerm: query,
    sortMatchDate,
    sortWeek,
  });

  return (
    <MatchesTable
      matches={matches}
      pagination={pagination}
      roles={session?.user.roles as string[]}
    />
  );
};

export default MatchesWrapper;