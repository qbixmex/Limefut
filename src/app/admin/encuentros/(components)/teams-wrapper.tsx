import type { FC } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { fetchTeamsAction } from '../../equipos/(actions)/fetchTeamsAction';
import { TeamsTable } from '../../equipos/(components)/teams-table';

type Props = Readonly<{
  tournamentId: string;
  currentPage: number;
  query: string;
}>;

export const TeamsWrapper: FC<Props> = async ({
  tournamentId,
  currentPage,
  query,
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { teams, pagination } = await fetchTeamsAction(tournamentId, {
    page: currentPage,
    take: 12,
    searchTerm: query,
  });

  return (
    <>
      <TeamsTable
        teams={teams}
        pagination={pagination}
        roles={session?.user.roles as string[]}
      />
    </>
  );

};

export default TeamsWrapper;
