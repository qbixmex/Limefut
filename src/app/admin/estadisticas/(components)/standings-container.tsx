import { type FC, Suspense } from 'react';
import { StandingsContent } from './standings-content';
import { SkeletonTable } from './SkeletonTable';
import { fetchTournamentByPermalinkAndCategory } from '@/shared/actions/fetchTournamentByPermalinkAndCategory';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  searchParams: Promise<{
    torneo: string;
    categoria: string;
  }>;
}>;

export const StandingsContainer: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).torneo;
  const categoryPermalink = (await searchParams).categoria;

  if (!tournamentPermalink || !categoryPermalink) {
    return null;
  }

  const { ok, message, tournamentId } = await fetchTournamentByPermalinkAndCategory({
    permalink: tournamentPermalink,
    category: categoryPermalink,
  });

  if (!ok && !tournamentId) {
    redirect(`${ROUTES.ADMIN_STANDINGS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <Suspense
      key={`${tournamentPermalink ?? 'tournament'}-${categoryPermalink ?? 'category'}`}
      fallback={<SkeletonTable />}
    >
      <StandingsContent tournamentId={tournamentId as string} />
    </Suspense>
  );
};

export default StandingsContainer;
