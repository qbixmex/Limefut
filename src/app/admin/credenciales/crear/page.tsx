import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CredentialForm } from "../(components)/CredentialForm";
import type { Session } from "next-auth";
import { auth } from "@/auth";
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
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Credencial</CardTitle>
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
