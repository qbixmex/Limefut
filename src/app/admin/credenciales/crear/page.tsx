import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CredentialForm } from "../(components)/CredentialForm";
import { Session } from "next-auth";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { fetchPlayersForCredentialForm } from "../(actions)/fetchPlayersForCredentialForm";

const CreateMatchPage = async () => {
  const session = await auth();

  if (!session?.user.roles.includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear credenciales !';
    redirect(`/admin/credenciales?error=${encodeURIComponent(message)}`);
  }

  const response = await fetchPlayersForCredentialForm();

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Crear Credencial</CardTitle>
          </CardHeader>
          <CardContent>
            <CredentialForm
              session={session as Session}
              players={response.players ?? []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateMatchPage;
