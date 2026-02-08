import { Suspense, type FC } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Session } from "@/lib/auth-client";
import { fetchCoachAction } from "../../(actions)";
import { CoachForm } from "../../(components)/coachForm";
import { fetchTeamsForCoach } from "../../(actions)/fetchTeamsForCoach";
import { headers } from "next/headers";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditCoachPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <EditCoachPageContent params={params} />
    </Suspense>
  );
};

const EditCoachPageContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
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

export default EditCoachPage;
