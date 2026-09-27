import { type FC, Suspense } from 'react';
import { TeamsTableSkeleton } from './teams-table-skeleton';
import { TeamsWrapper } from './teams-wrapper';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import { fetchAdminTournamentAction } from '@/shared/actions/fetch-admin-tournament.action';
import { fetchAdminCategoryAction } from '@/shared/actions/fetch-admin-category.action';

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

  const isNoTournament = tournamentPermalink === 'none';

  let tournamentId = tournamentPermalink;

  if (!isNoTournament) {
    const responseTournament = await fetchAdminTournamentAction(
      tournamentPermalink,
    );

    if (!responseTournament.ok) {
      redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(responseTournament.message)}`);
    }

    tournamentId = (responseTournament.tournament as { id: string }).id;
  }

  const responseCategory = await fetchAdminCategoryAction(
    categoryPermalink,
  );

  if (!responseCategory.ok) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(responseCategory.message)}`);
  }

  const category = responseCategory.category as { id: string };

  return (
    <>
      <Suspense
        key={
          `${tournamentId}-` +
          `${category.id ?? 'category'}-` +
          `${query ?? 'query'}-` +
          currentPage
        }
        fallback={<TeamsTableSkeleton colCount={9} rowCount={6} />}
      >
        <TeamsWrapper
          tournamentId={tournamentId}
          categoryId={category.id}
          currentPage={+currentPage}
          query={query}
        />
      </Suspense>
    </>
  );
};
