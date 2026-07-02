import { type FC, Suspense } from 'react';
import { StandingsContent } from './standings-content';
import { SkeletonTable } from './SkeletonTable';
import { fetchAdminTournamentAction } from '@/shared/actions/fetch-admin-tournament.action';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { fetchAdminCategoryAction } from '@/shared/actions/fetch-admin-category.action';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const StandingsView: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).tournament;
  const categoryPermalink = (await searchParams).category;

  if (!tournamentPermalink || !categoryPermalink) {
    return null;
  }

  const responseTournament = await fetchAdminTournamentAction(
    tournamentPermalink,
  );

  if (!responseTournament.ok) {
    redirect(`${ROUTES.ADMIN_STANDINGS}?error=${encodeURIComponent(responseTournament.message)}`);
  }

  const responseCategory = await fetchAdminCategoryAction(
    categoryPermalink,
  );

  if (!responseCategory.ok) {
    redirect(`${ROUTES.ADMIN_STANDINGS}?error=${encodeURIComponent(responseCategory.message)}`);
  }

  const tournament = responseTournament.tournament as { id: string };
  const category = responseCategory.category as { id: string };

  return (
    <Suspense
      key={`${tournamentPermalink ?? 'tournament'}-${categoryPermalink ?? 'category'}`}
      fallback={<SkeletonTable />}
    >
      <StandingsContent
        tournamentId={tournament.id}
        categoryId={category.id}
      />
    </Suspense>
  );
};
