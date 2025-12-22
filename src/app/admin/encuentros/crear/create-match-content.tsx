import { Suspense, type FC } from 'react';
import { MatchForm } from '../(components)/matchForm';
import type { Session } from "next-auth";
import { redirect } from 'next/navigation';
import { fetchTeamsForMatchAction } from '../(actions)/fetchTeamsForMatchAction';
import type { Team } from '~/src/shared/interfaces';
import { auth } from '~/src/auth';
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
  const session = await auth();

  if (!session?.user.roles.includes('admin')) {
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


