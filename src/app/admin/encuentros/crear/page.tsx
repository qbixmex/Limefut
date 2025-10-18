import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MatchForm } from "../(components)/matchForm";
import { Session } from "next-auth";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { fetchTournamentsAction } from "../(actions)";

const CreateMatchPage = async () => {
  const session = await auth();

  if (!session?.user.roles.includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear encuentros !';
    redirect(`/admin/encuentros?error=${encodeURIComponent(message)}`);
  }

  const tournaments = await fetchTournamentsAction();

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Crear Encuentro</CardTitle>
          </CardHeader>
          <CardContent>
            <MatchForm
              session={session as Session}
              tournaments={tournaments.tournaments || []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateMatchPage;
