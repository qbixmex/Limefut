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
import { fetchPlayerAction } from "../../(actions)";
import { PlayerForm } from "../../(components)/playerForm";
import { Player } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCoach: FC<Props> = async ({ params }) => {
  const session = await auth();
  const coachId = (await params).id;
  const response = await fetchPlayerAction(coachId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/jugadores?error=${encodeURIComponent(response.message)}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Editar Jugador</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerForm
              session={session as Session}
              player={response.player as Player}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCoach;
