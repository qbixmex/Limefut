import type { FC } from 'react';
import { getSession } from '@/lib/get-session';
import { fetchAdminTeamsAction } from '../../equipos/(actions)/fetch-admin-teams.action';
import { TeamsTable } from '../../equipos/(components)/teams-table';

type Props = Readonly<{
  tournamentId: string;
  categoryId: string;
  currentPage: number;
  query: string;
}>;

export const TeamsWrapper: FC<Props> = async ({
  tournamentId,
  categoryId,
  currentPage,
  query,
}) => {
  const session = await getSession();

  const { teams, pagination } = await fetchAdminTeamsAction(
    tournamentId,
    categoryId,
    {
      page: currentPage,
      take: 12,
      searchTerm: query,
    },
  );

  return (
    <TeamsTable
      teams={teams}
      pagination={pagination}
      roles={session?.user.roles as string[]}
    />
  );
};
