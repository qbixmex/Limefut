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
import { fetchMatchAction, fetchTournamentsAction } from "../../(actions)";
import { Match, Team, Tournament } from '@/shared/interfaces';
import { fetchTeamsForMatchAction } from "../../(actions)/fetchTeamsForMatchAction";
import { MatchForm } from "../../(components)/MatchForm";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditMatch: FC<Props> = async ({ params }) => {
  const session = await auth();
  const id = (await params).id;

  const responseMatch = await fetchMatchAction(id, session?.user.roles ?? null);

  if (!responseMatch.ok) {
    redirect(`/admin/encuentros?error=${encodeURIComponent(responseMatch.message)}`);
  }

  const responseTeams = await fetchTeamsForMatchAction();

  if (!responseTeams.ok) {
    redirect(`/admin/encuentros?error=${encodeURIComponent(responseTeams.message)}`);
  }

  const teams = responseTeams.teams as Team[];

  const tournaments = await fetchTournamentsAction();
  const match = responseMatch.match as Match & { tournament: Pick<Tournament, 'id' | 'name'> };

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Editar Encuentro</CardTitle>
          </CardHeader>
          <CardContent>
            <MatchForm
              tournaments={tournaments.tournaments || []}
              session={session as Session}
              match={match}
              initialTeams={teams}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditMatch;
