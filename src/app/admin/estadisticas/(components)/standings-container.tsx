import { type FC, Suspense } from 'react';
import { StandingsContent } from './standings-content';
import { SkeletonTable } from './SkeletonTable';
import { fetchAdminTournamentAction } from '@/shared/actions/fetch-admin-tournament.action';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const StandingsContainer: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).tournament;
  const categoryPermalink = (await searchParams).category;

  if (!tournamentPermalink || !categoryPermalink) {
    return null;
  }

  const { ok, message, tournament } = await fetchAdminTournamentAction(
    tournamentPermalink,
  );

  if (!ok && !tournament) {
    redirect(`${ROUTES.ADMIN_STANDINGS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <Suspense
      key={`${tournamentPermalink ?? 'tournament'}-${categoryPermalink ?? 'category'}`}
      fallback={<SkeletonTable />}
    >
      <StandingsContent tournamentId={tournament?.id as string} />
    </Suspense>
  );
};

export default StandingsContainer;
