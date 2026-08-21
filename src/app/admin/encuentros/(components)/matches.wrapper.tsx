import type { FC } from 'react';
import { MatchesTable } from './matches-table';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { fetchMatchesAction } from '@/app/admin/encuentros/(actions)/fetch-matches.action';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

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
  const { ok, message, matches, pagination } = await fetchMatchesAction({
    tournamentId,
    categoryId,
    page: currentPage,
    take: 12,
    searchTerm: query,
    sortMatchDate,
    sortWeek,
    status,
  });

  if (!ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(message)}`);
  }

  const matchesWeeks = [...new Set(
    matches.flatMap(match => (match.week !== null) ? [match.week] : []),
  )];

  return (
    <MatchesTable
      matchesWeeks={matchesWeeks}
      matches={matches}
      pagination={pagination}
    />
  );
};
