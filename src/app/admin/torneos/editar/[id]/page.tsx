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
import { fetchTournamentAction } from "../../(actions)";
import { TournamentForm } from "../../(components)/tournamentForm";
import type { Tournament } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditTournament: FC<Props> = async ({ params }) => {
  const session = await auth();
  const tournamentId = (await params).id;
  const response = await fetchTournamentAction(tournamentId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/torneos?error=${encodeURIComponent(response.message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <TournamentForm
              session={session as Session}
              tournament={response.tournament as Tournament}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTournament;
