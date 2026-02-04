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
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Credencial</CardTitle>
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
