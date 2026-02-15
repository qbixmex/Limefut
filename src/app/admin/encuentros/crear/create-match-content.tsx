import { Suspense, type FC } from 'react';
import { headers } from 'next/headers';
import { MatchForm } from '../(components)/matchForm';
import { redirect } from 'next/navigation';
import { fetchTeamsForMatchAction } from '../(actions)/fetchTeamsForMatchAction';
import type { Team } from '@/shared/interfaces';
import { auth } from '@/lib/auth';
import type { Session } from '@/lib/auth-client';
import { FormSkeleton } from '../(components)/form-skeleton';

type MatchWrapperProps = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    semana?: string;
  }>;
}>;

export const MatchWrapper: FC<MatchWrapperProps> = async ({ searchParams }) => {
  const tournamentId = (await searchParams).torneo;
  const week = (await searchParams).semana;

  return (
    <>
      <Suspense
        key={`permalink-${tournamentId}_week-${week}`}
        fallback={<FormSkeleton />}
      >
        <CreateMatchContent
          tournamentId={tournamentId}
          week={week}
        />
      </Suspense>
    </>
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

  const teams = responseTeams.teams as Team[];

  return (
    <section className="mt-10">
      <MatchForm
        session={session as Session}
        initialTeams={teams}
        tournamentId={tournamentId}
        week={parseInt(week)}
      />
    </section>
  );
};


