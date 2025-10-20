import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamForm } from "../(components)/teamForm";
import { Session } from "next-auth";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { fetchTournamentsForTeam } from "../(actions)";
import { Coach, type Tournament } from "@/shared/interfaces";
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
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Crear Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamForm
              session={session as Session}
              tournaments={tournaments as Tournament[]}
              coaches={coaches as Coach[]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTeam;