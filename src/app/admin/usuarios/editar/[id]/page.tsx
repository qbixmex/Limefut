import type { FC } from "react";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersForm } from "../../(components)/usersForm";
import { auth } from "@/lib/auth";
import { fetchUserAction } from "../../(actions)/fetchUserAction";
import { redirect } from "next/navigation";
import type { Session } from "@/lib/auth-client";
import type { User } from "@/shared/interfaces";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditUser: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = (await params).id;
  const response = await fetchUserAction(userId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/users?error=${encodeURIComponent(response.message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersForm
              session={session as Session}
              user={response.user as User}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditUser;
