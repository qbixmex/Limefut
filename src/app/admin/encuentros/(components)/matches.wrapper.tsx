import type { FC } from 'react';
import { auth } from '@/lib/auth';
import { MatchesTable } from './matches-table';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { headers } from 'next/headers';
import { fetchMatchesAction } from '@/app/admin/encuentros/(actions)/fetch-matches.action';

type Props = Readonly<{
  tournamentId: string;
  categoryId: string;
  currentPage: number;
  query: string;
  sortMatchDate: 'asc' | 'desc';
  sortWeek: `${number}` | 'asc' | 'desc' | undefined;
  status: MATCH_STATUS_TYPE;
}>;

export const MatchesWrapper: FC<Props> = async ({
  tournamentId,
  categoryId,
  currentPage,
  query,
  sortMatchDate,
  sortWeek,
  status,
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const { matches, pagination } = await fetchMatchesAction({
    tournamentId,
    categoryId,
    page: currentPage,
    take: 12,
    searchTerm: query,
    sortMatchDate,
    sortWeek,
    status,
  });

  const matchesWeeks = [...new Set(
    matches.flatMap(match => (match.week !== null) ? [match.week] : []),
  )];

  return (
    <MatchesTable
      matchesWeeks={matchesWeeks}
      matches={matches}
      pagination={pagination}
      roles={session?.user.roles as string[]}
    />
  );
};
