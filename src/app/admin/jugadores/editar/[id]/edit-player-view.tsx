import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { Session } from '@/lib/auth-client';
import { fetchPlayerAction, fetchTeamsForPlayer } from '../../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { EditPlayerForm } from '../../(components)/edit-player-form';

type Props = Readonly<{
  paramsPromise: Promise<{
    id: string;
  }>;
  searchParamsPromise: Promise<{ tournament?: string }>;
}>;

export const EditPlayerView: FC<Props> = async ({ paramsPromise, searchParamsPromise }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const playerId = (await paramsPromise).id;
  const { tournament } = await searchParamsPromise;

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para editar jugadores !';
    redirect(`${ROUTES.ADMIN_PLAYERS}?error=${encodeURIComponent(message)}`);
  }

  const responsePlayer = await fetchPlayerAction(playerId, session?.user.roles ?? null);

  if (!responsePlayer.ok) {
    redirect(`${ROUTES.ADMIN_PLAYERS}?error=${encodeURIComponent(responsePlayer.message)}`);
  }

  const responseTeams = await fetchTeamsForPlayer(tournament as string);

  if (!responseTeams.ok) {
    redirect(`${ROUTES.ADMIN_PLAYERS}?error=${encodeURIComponent(responseTeams.message)}`);
  }

  const player = responsePlayer.player!;
  const teams = responseTeams.teams!;

  return (
    <EditPlayerForm
      key={randomUUID()}
      session={session as Session}
      player={player}
      teams={teams}
    />
  );
};
