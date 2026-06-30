import { type FC, Suspense } from 'react';
import { TeamsTableSkeleton } from './teams-table-skeleton';
import { TeamsWrapper } from './teams-wrapper';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import { fetchAdminTournamentAction } from '@/shared/actions/fetch-admin-tournament.action';

type Props = Readonly<{
  searchParamsPromise: Promise<{
    query?: string;
    page?: string;
    tournament?: string;
    category?: string;
  }>;
}>;

export const TeamsContent: FC<Props> = async ({ searchParamsPromise }) => {
  const {
    tournament: tournamentPermalink,
    category: categoryPermalink,
    query = '',
    page: currentPage = 1,
  } = await searchParamsPromise;

  if (!tournamentPermalink || !categoryPermalink) return null;

  const { ok, message, tournamentId } = await fetchAdminTournamentAction({
    tournamentPermalink,
    categoryPermalink,
  });

  if (!ok && !tournamentId) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <>
      <Suspense
        key={
          `${tournamentPermalink ?? 'tournament'}-` +
          `${categoryPermalink ?? 'category'}-` +
          `${query ?? 'query'}-` +
          currentPage
        }
        fallback={<TeamsTableSkeleton colCount={9} rowCount={6} />}
      >
        <TeamsWrapper
          tournamentId={tournamentId!}
          currentPage={+currentPage}
          query={query}
        />
      </Suspense>
    </>
  );
};
