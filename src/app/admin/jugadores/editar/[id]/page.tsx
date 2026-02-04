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
import { fetchPlayerAction, fetchTeamsForPlayer } from "../../(actions)";
import { PlayerForm } from "../../(components)/playerForm";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCoach: FC<Props> = async ({ params }) => {
  const session = await auth();
  const coachId = (await params).id;
  const responsePlayer = await fetchPlayerAction(coachId, session?.user.roles ?? null);

  if (!responsePlayer.ok) {
    redirect(`/admin/jugadores?error=${encodeURIComponent(responsePlayer.message)}`);
  }

  const responseTeams = await fetchTeamsForPlayer();

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

export default EditCoach;
