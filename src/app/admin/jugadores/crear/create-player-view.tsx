import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { fetchTeamsForPlayer } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { CreatePlayerForm } from '../(components)/create-player-form';

type Props = Readonly<{
  searchParamsPromise: Promise<{
    tournament?: string;
  }>;
}>;

export const CreatePlayerView = async ({ searchParamsPromise }: Props) => {
  const { tournament } = await searchParamsPromise;

  const responseTeams = await fetchTeamsForPlayer(tournament as string);

  if (!responseTeams.ok) {
    redirect(`${ROUTES.ADMIN_PLAYERS}?error=${encodeURIComponent(responseTeams.message)}`);
  }

  const teams = responseTeams.teams!;

  return (
    <CreatePlayerForm
      key={randomUUID()}
      teams={teams}
    />
  );
};
