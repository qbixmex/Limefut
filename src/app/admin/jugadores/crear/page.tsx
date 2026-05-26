import type { FC } from 'react';
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlayerForm } from '../(components)/playerForm';
import type { Session } from '@/lib/auth-client';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { fetchTeamsForPlayer } from '../(actions)';
import { headers } from 'next/headers';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

const CreatePlayerPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <CreatePlayerContent searchParams={searchParams} />
    </Suspense>
  );
};

const CreatePlayerContent: FC<Props> = async ({ searchParams }) => {
  const { tournament, category } = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && !(session?.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear jugadores !';
    redirect(`${ROUTES.ADMIN_PLAYERS}?error=${encodeURIComponent(message)}`);
  }

  const responseTeams = await fetchTeamsForPlayer({
    tournamentPermalink: tournament,
    categoryPermalink: category,
  });

  if (!responseTeams.ok) {
    redirect(`${ROUTES.ADMIN_PLAYERS}?error=${encodeURIComponent(responseTeams.message)}`);
  }

  const teams = responseTeams.teams!;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Jugador</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerForm
              session={session as Session}
              teams={teams}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePlayerPage;
