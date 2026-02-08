import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CredentialForm } from "../(components)/CredentialForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const CreateMatchPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session && !(session?.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear credenciales !';
    redirect(`/admin/credenciales?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Credencial</CardTitle>
          </CardHeader>
          <CardContent>
            <CredentialForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateMatchPage;
