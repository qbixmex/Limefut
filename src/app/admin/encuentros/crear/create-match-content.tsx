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
    torneo?: string;
    categoria?: string;
    semana?: string;
  }>;
}>;

export const MatchWrapper: FC<MatchWrapperProps> = async ({ searchParams }) => {
  const {
    torneo: tournament,
    categoria: category,
    semana: week,
  } = await searchParams;

  if (!tournament || !category || !week) {
    return null;
  }

  const { ok, message, tournamentId } = await fetchTournamentByPermalinkAndCategory({
    permalink: tournament,
    category,
  });

  if (!ok && !tournamentId) {
    redirect(`${ROUTES.ADMIN_TOURNAMENTS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <Suspense
      key={`${tournament ?? 'tournament'}-${category ?? 'category'}-${week ?? 'week'}`}
      fallback={<FormSkeleton />}
    >
      <CreateMatchContent
        tournamentId={tournamentId as string}
        week={week}
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
