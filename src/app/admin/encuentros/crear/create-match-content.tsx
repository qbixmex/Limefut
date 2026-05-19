import { Suspense, type FC } from 'react';
import { headers } from 'next/headers';
import { MatchForm } from '../(components)/matchForm';
import { redirect } from 'next/navigation';
import { fetchTeamsForMatchAction } from '../(actions)/fetchTeamsForMatchAction';
import { auth } from '@/lib/auth';
import type { Session } from '@/lib/auth-client';
import { FormSkeleton } from '../(components)/form-skeleton';
import { fetchTournamentByPermalinkAndCategory } from '@/shared/actions/fetchTournamentByPermalinkAndCategory';
import { ROUTES } from '@/shared/constants/routes';

type MatchWrapperProps = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    ['selected-week']?: string;
  }>;
}>;

export const MatchWrapper: FC<MatchWrapperProps> = async ({ searchParams }) => {
  const {
    tournament: tournamentPermalink,
    category: categoryPermalink,
    'selected-week': selectedWeek,
  } = await searchParams;

  if (!tournamentPermalink || !categoryPermalink || !selectedWeek) {
    return null;
  }

  const { ok, message, tournamentId } = await fetchTournamentByPermalinkAndCategory({
    tournamentPermalink,
    categoryPermalink,
  });

  if (!ok && !tournamentId) {
    redirect(`${ROUTES.ADMIN_TOURNAMENTS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <Suspense
      key={
        `${tournamentPermalink ?? 'tournament'}-` +
        `${categoryPermalink ?? 'category'}-` +
        `${selectedWeek ?? 'selected-week'}`}
      fallback={<FormSkeleton />}
    >
      <CreateMatchContent
        tournamentId={tournamentId as string}
        week={selectedWeek}
      />
    </Suspense>
  );
};

type CreateMatchContentProps = Readonly<{
  tournamentId: string | undefined;
  week: string | undefined;
}>;

const CreateMatchContent: FC<CreateMatchContentProps> = async ({ tournamentId, week }) => {
  if (!tournamentId || !week) return null;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!(session?.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear encuentros !';
    redirect(`/admin/encuentros?error=${encodeURIComponent(message)}`);
  }

  const responseTeams = await fetchTeamsForMatchAction({
    tournamentId: tournamentId as string,
    week: parseInt(week as string),
  });

  if (!responseTeams.ok) {
    redirect(`/admin/encuentros?error=${encodeURIComponent(responseTeams.message)}`);
  }

  return (
    <section className="mt-10">
      <MatchForm
        session={session as Session}
        initialTeams={responseTeams.teams}
        tournamentId={tournamentId}
        week={parseInt(week)}
      />
    </section>
  );
};
