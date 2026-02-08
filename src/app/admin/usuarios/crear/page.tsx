import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersForm } from "../(components)/usersForm";
import type { Session } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { headers } from "next/headers";

const CreateUserPage = () => {
  return (
    <Suspense>
      <CreateUserContent />
    </Suspense>
  );
};

const CreateUserContent = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session && !(session?.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear usuarios !';
    redirect(`/admin/users?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersForm session={session as Session} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateUserPage;
