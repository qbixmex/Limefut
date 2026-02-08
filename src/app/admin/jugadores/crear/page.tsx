import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlayerForm } from "../(components)/playerForm";
import type { Session } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchTeamsForPlayer } from "../(actions)";
import { headers } from "next/headers";

const CreatePlayerPage = () => {
  return (
    <Suspense>
      <CreatePlayerContent />
    </Suspense>
  );
};

const CreatePlayerContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && !(session?.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear jugadores !';
    redirect(`/admin/jugadores?error=${encodeURIComponent(message)}`);
  }

  const responseTeams = await fetchTeamsForPlayer();

  if (!responseTeams.ok) {
    redirect(`/admin/jugadores?error=${encodeURIComponent(responseTeams.message)}`);
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