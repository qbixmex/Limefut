import { FC } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { fetchTeamAction, fetchTournamentsForTeam } from "../../(actions)";
import { TeamForm } from "../../(components)/teamForm";
import { Coach, Tournament } from '@/shared/interfaces';
import { fetchCoachesForTeam } from "../../(actions)/fetchCoachesForTeam";

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

export const EditTeam: FC<Props> = async ({ params }) => {
  const session = await auth();
  const permalink = (await params).permalink;
  const responseTeam = await fetchTeamAction(permalink, session?.user.roles ?? null);

  if (!responseTeam.ok) {
    redirect(`/admin/users?error=${encodeURIComponent(responseTeam.message)}`);
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
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Editar Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamForm
              session={session as Session}
              team={responseTeam.team!}
              tournaments={tournaments as Tournament[]}
              coaches={coaches as Coach[]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTeam;
