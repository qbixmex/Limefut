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
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Entrenador</CardTitle>
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
