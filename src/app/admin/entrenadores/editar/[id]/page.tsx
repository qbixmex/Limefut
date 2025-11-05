import type { FC } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { fetchCoachAction } from "../../(actions)";
import { CoachForm } from "../../(components)/coachForm";
import { fetchTeamsForCoach } from "../../(actions)/fetchTeamsForCoach";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCoach: FC<Props> = async ({ params }) => {
  const session = await auth();
  const coachId = (await params).id;
  const response = await fetchCoachAction(coachId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/entrenadores?error=${encodeURIComponent(response.message)}`);
  }

  const responseTeams = await fetchTeamsForCoach();

  if (!responseTeams.ok) {
    redirect(`/admin/entrenadores?error=${encodeURIComponent(responseTeams.message)}`);
  }

  const teams = responseTeams.teams!;

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Editar Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <CoachForm
              session={session as Session}
              teams={teams}
              coach={response.coach!}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCoach;
