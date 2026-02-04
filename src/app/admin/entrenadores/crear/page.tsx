import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoachForm } from "../(components)/coachForm";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchTeamsForCoach } from "../(actions)/fetchTeamsForCoach";

export const CreateCoach = async () => {
  const session = await auth();

  if (!session?.user.roles.includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear entrenadores !';
    redirect(`/admin/entrenadores?error=${encodeURIComponent(message)}`);
  }

  const responseTeams = await fetchTeamsForCoach();

  if (!responseTeams.ok) {
    redirect(`/admin/entrenadores?error=${encodeURIComponent(responseTeams.message)}`);
  }

  const teams = responseTeams.teams;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Entrenador</CardTitle>
          </CardHeader>
          <CardContent>
            <CoachForm
              session={session as Session}
              teams={teams!}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCoach;