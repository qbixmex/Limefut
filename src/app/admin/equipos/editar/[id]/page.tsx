import { Suspense, type FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Session } from '@/lib/auth-client';
import { fetchTeamAction, fetchTournamentsForTeam, type TournamentType } from '../../(actions)';
import { TeamForm } from '../../(components)/teamForm';
import type { Coach } from '@/shared/interfaces';
import { fetchCoachesForTeam } from '../../(actions)/fetchCoachesForTeam';
import { headers } from 'next/headers';
import { fetchFieldsForTeam } from '../../(actions)/fetchFieldsForTeam';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditTeamPage: FC<Props> = async ({ params }) => {
  return (
    <Suspense>
      <EditTeamPageContent params={params} />
    </Suspense>
  );
};

const EditTeamPageContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const teamId = (await params).id;

  const responseTeam = await fetchTeamAction(teamId, session?.user.roles ?? null);

  if (!responseTeam.team) {
    redirect(`/admin/equipos?error=${encodeURIComponent(responseTeam.message)}`);
  }

  const responseTournaments = await fetchTournamentsForTeam();

  if (!responseTournaments.ok) {
    redirect(`/admin/equipos?error=${encodeURIComponent(responseTournaments.message)}`);
  }

  const responseCoaches = await fetchCoachesForTeam();

  if (!responseCoaches.ok) {
    redirect(`/admin/equipos?error=${encodeURIComponent(responseCoaches.message)}`);
  }

  const responseFields = await fetchFieldsForTeam();

  const tournaments = responseTournaments.tournaments;
  const coaches = responseCoaches.coaches;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamForm
              key={teamId}
              session={session as Session}
              team={responseTeam.team}
              fields={responseFields.fields}
              tournaments={tournaments as TournamentType[]}
              coaches={coaches as Coach[]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTeamPage;
