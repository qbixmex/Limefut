import { randomUUID } from "node:crypto";
import { Suspense, type FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchTournamentAction } from "../../(actions)";
import { TournamentForm } from "../../(components)/tournamentForm";
import type { Tournament } from '@/shared/interfaces';
import { headers } from "next/headers";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

type EditTournamentContentProps = Readonly<{
  paramsPromise: Promise<{
    id: string;
  }>;
}>;

const EditTournamentPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EditTournamentContent paramsPromise={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EditTournamentContent: FC<EditTournamentContentProps> = async ({ paramsPromise }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const tournamentId = (await paramsPromise).id;
  const response = await fetchTournamentAction(tournamentId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/torneos?error=${encodeURIComponent(response.message)}`);
  }

  return (
    <TournamentForm
      key={randomUUID()}
      session={session!}
      tournament={response.tournament as Tournament}
    />
  );
};

export default EditTournamentPage;
