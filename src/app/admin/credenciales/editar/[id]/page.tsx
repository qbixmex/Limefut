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
import { fetchCredentialAction, fetchPlayersForCredentialForm } from "../../(actions)";
import { CredentialForm } from "../../(components)/CredentialForm";
import { type Credential } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCredential: FC<Props> = async ({ params }) => {
  const session = await auth();
  const id = (await params).id;
  const responseCredentialAction = await fetchCredentialAction(id, session?.user.roles ?? null);

  if (!responseCredentialAction.ok) {
    redirect(`/admin/credenciales?error=${encodeURIComponent(responseCredentialAction.message)}`);
  }

  const responsePlayersResponse = await fetchPlayersForCredentialForm();

  if (!responsePlayersResponse.ok) {
    redirect(`/admin/credenciales?error=${encodeURIComponent(responsePlayersResponse.message)}`);
  }

  const credential = responseCredentialAction.credential;
  const players = responsePlayersResponse.players;

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Editar Credencial</CardTitle>
          </CardHeader>
          <CardContent>
            <CredentialForm
              session={session as Session}
              credential={credential as Credential}
              players={players || []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCredential;
