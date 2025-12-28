import { Suspense, type FC } from 'react';
import { ErrorHandler } from '~/src/shared/components/errorHandler';
import PlayersTableSkeleton from './players-table-skeleton';
import PlayersTable from './players-table';

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    equipo?: string;
    query?: string;
    page?: string;
  }>;
}>;

export const PlayersContent: FC<Props> = async ({ searchParams }) => {
  const {
    torneo: tournamentId,
    equipo: teamId,
    query = '',
    page: currentPage = 1,
  } = await searchParams;

  if (!tournamentId || !teamId) return null;

  return (
    <>
      <ErrorHandler />
      <Suspense
        key={`${tournamentId ?? 'tournament'}-${teamId ?? 'team'}-${query ?? 'query'}-${currentPage}`}
        fallback={<PlayersTableSkeleton colCount={6} rowCount={5} />}
      >
        <PlayersTable
          teamId={teamId as string}
          query={query}
          currentPage={currentPage as number}
        />
      </Suspense>
    </>
  );
};

export default PlayersContent;
