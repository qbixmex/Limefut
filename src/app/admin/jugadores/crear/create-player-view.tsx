import { randomUUID } from 'node:crypto';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { fetchTeamsForPlayer } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { CreatePlayerForm } from '../(components)/create-player-form';

type Props = Readonly<{
  searchParamsPromise: Promise<{
    tournament?: string;
  }>;
}>;

export const CreatePlayerView = async ({ searchParamsPromise }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear jugadores !';
    redirect(`${ROUTES.ADMIN_PLAYERS}?error=${encodeURIComponent(message)}`);
  }

  const { tournament } = await searchParamsPromise;

  const responseTeams = await fetchTeamsForPlayer(tournament as string);

  if (!responseTeams.ok) {
    redirect(`${ROUTES.ADMIN_PLAYERS}?error=${encodeURIComponent(responseTeams.message)}`);
  }

  const teams = responseTeams.teams!;

  return (
    <CreatePlayerForm
      key={randomUUID()}
      authenticatedUserId={session?.user.id}
      authenticatedUserRoles={session?.user.roles}
      teams={teams}
    />
  );
};
