import { Suspense, type FC } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import type { Session } from '@/lib/auth-client';
import { fetchPlayerAction, fetchTeamsForPlayer } from '../../(actions)';
import { PlayerForm } from '../../(components)/playerForm';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    torneo?: string;
  }>;
}>;

const EditPlayerPage: FC<Props> = ({ params, searchParams }) => {
  return (
    <Suspense>
      <EditPlayerContent
        params={params}
        searchParams={searchParams}
      />
    </Suspense>
  );
};

export const EditPlayerContent: FC<Props> = async ({ params, searchParams }) => {
  const tournamentId = (await searchParams).torneo;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const coachId = (await params).id;
  const responsePlayer = await fetchPlayerAction(coachId, session?.user.roles ?? null);

  if (!responsePlayer.ok) {
    redirect(`/admin/jugadores?error=${encodeURIComponent(responsePlayer.message)}`);
  }

  const responseTeams = await fetchTeamsForPlayer(tournamentId ?? '');

  if (!responseTeams.ok) {
    redirect(`/admin/jugadores?error=${encodeURIComponent(responseTeams.message)}`);
  }

  const player = responsePlayer.player!;
  const teams = responseTeams.teams!;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Jugador</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerForm
              session={session as Session}
              player={player}
              teams={teams}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPlayerPage;
