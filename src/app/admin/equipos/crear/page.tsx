import crypto from "node:crypto";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamForm } from "../(components)/teamForm";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchTournamentsForTeam } from "../(actions)";
import type { Coach } from "@/shared/interfaces";
import { fetchCoachesForTeam } from "../(actions)/fetchCoachesForTeam";

export const CreateTeam = async () => {
  const session = await auth();

  if (!session?.user.roles.includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear equipos !';
    redirect(`/admin/equipos?error=${encodeURIComponent(message)}`);
  }

  const responseTeams = await fetchTournamentsForTeam();

  if (!responseTeams.ok) {
    redirect(`/admin/equipos?error=${encodeURIComponent(responseTeams.message)}`);
  }

  if (responseTeams.ok && responseTeams.tournaments?.length === 0) {
    redirect(`/admin/equipos?error=${encodeURIComponent('¡ No puedes crear un equipo sin torneos activos !')}`);
  }

  const responseCoaches = await fetchCoachesForTeam();

  if (!responseCoaches.ok) {
    redirect(`/admin/equipos?error=${encodeURIComponent(responseCoaches.message)}`);
  }

  if (responseCoaches.ok && responseCoaches.coaches?.length === 0) {
    redirect(`/admin/equipos?error=${encodeURIComponent('¡ No puedes crear un equipo sin entrenadores activos !')}`);
  }

  const tournaments = responseTeams.tournaments;
  const coaches = responseCoaches.coaches;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamForm
              key={crypto.randomUUID()}
              session={session as Session}
              tournaments={tournaments}
              coaches={coaches as Coach[]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTeam;