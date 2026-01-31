import type { FC } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { fetchTeamAction, fetchTournamentsForTeam, type TournamentType } from "../../(actions)";
import { TeamForm } from "../../(components)/teamForm";
import type { Coach } from '@/shared/interfaces';
import { fetchCoachesForTeam } from "../../(actions)/fetchCoachesForTeam";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditTeam: FC<Props> = async ({ params }) => {
  const session = await auth();
  const teamId = (await params).id;
  const responseTeam = await fetchTeamAction(teamId, session?.user.roles ?? null);

  if (!responseTeam.team) {
    redirect(`/admin/equipos?error=${encodeURIComponent(responseTeam.message)}`);
  }

  const responseTeams = await fetchTournamentsForTeam();

  if (!responseTeams.ok) {
    redirect(`/admin/equipos?error=${encodeURIComponent(responseTeams.message)}`);
  }

  const responseCoaches = await fetchCoachesForTeam();

  if (!responseCoaches.ok) {
    redirect(`/admin/equipos?error=${encodeURIComponent(responseCoaches.message)}`);
  }
  const tournaments = responseTeams.tournaments;
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
              team={responseTeam.team!}
              tournaments={tournaments as TournamentType[]}
              coaches={coaches as Coach[]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTeam;
