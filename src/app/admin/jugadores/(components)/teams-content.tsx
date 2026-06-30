import { fetchAdminTournamentAction } from '@/shared/actions/fetch-admin-tournament.action';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import { Suspense, type FC } from 'react';
import { TeamsSelectorSkeleton } from './teams-selector-skeleton';
import { TeamsSelector } from './teams-selector';
import { fetchAdminTeamsAction } from '../../equipos/(actions)';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    team?: string;
    query?: string;
    page?: string;
  }>;
}>;

export const TeamsContent: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).tournament;
  const categoryPermalink = (await searchParams).category;

  if (!tournamentPermalink || !categoryPermalink) {
    return null;
  }

  const { ok, message, tournamentId } = await fetchAdminTournamentAction({
    tournamentPermalink,
    categoryPermalink,
  });

  if (!ok && !tournamentId) {
    redirect(`${ROUTES.ADMIN_PLAYERS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <Suspense fallback={<TeamsSelectorSkeleton />}>
      <TeamsWrapper tournamentId={tournamentId as string} />
    </Suspense>
  );
};

const TeamsWrapper: FC<{ tournamentId: string }> = async ({ tournamentId }) => {
  const { teams } = await fetchAdminTeamsAction(tournamentId as string);

  return (
    <section className="w-full lg:w-1/2 2xl:w-full 2xl:max-w-[600px]">
      <TeamsSelector teams={teams} />
    </section>
  );
};
