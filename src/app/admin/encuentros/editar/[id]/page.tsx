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
import { MatchForm } from "../../(components)/matchForm";
import { Match } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditMatch: FC<Props> = async ({ params }) => {
  const session = await auth();
  const id = (await params).id;
  const response = await fetchMatchAction(id, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/encuentros?error=${encodeURIComponent(response.message)}`);
  }

  const tournaments = await fetchTournamentsAction();

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
              match={response.match as Match}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditMatch;
