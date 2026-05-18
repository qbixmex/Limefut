import { Suspense, type FC } from 'react';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { PlayersTableSkeleton } from './players-table-skeleton';
import { PlayersTable } from './players-table';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    team?: string;
    query?: string;
    page?: string;
  }>;
}>;

export const PlayersContent: FC<Props> = async ({ searchParams }) => {
  const {
    tournament: tournamentPermalink,
    category: categoryPermalink,
    team: teamPermalink,
    query = '',
    page: currentPage = 1,
  } = await searchParams;

  if (!tournamentPermalink || !categoryPermalink || !teamPermalink) return null;

  return (
    <>
      <ErrorHandler />
      <Suspense
        key={
          `${tournamentPermalink ?? 'tournament'}-` +
          `${categoryPermalink ?? 'category'}-` +
          `${teamPermalink ?? 'team'}-` +
          `${query ?? 'query'}-${currentPage}`
        }
        fallback={<PlayersTableSkeleton colCount={6} rowCount={5} />}
      >
        <PlayersTable
          teamId={teamPermalink as string}
          query={query}
          currentPage={currentPage as number}
        />
      </Suspense>
    </>
  );
};
