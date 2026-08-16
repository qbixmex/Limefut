import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { redirect } from 'next/navigation';
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
  const playerId = (await paramsPromise).id;
  const { tournament } = await searchParamsPromise;

  const responsePlayer = await fetchPlayerAction({
    playerId,
  });

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
      player={player}
      teams={teams}
    />
  );
};
