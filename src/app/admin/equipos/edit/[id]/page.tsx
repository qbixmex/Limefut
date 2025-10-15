import { FC } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserForm } from "../../(components)/userForm";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { User } from "@/root/next-auth";
import { Session } from "next-auth";
import { fetchUserAction } from "../../../users/(actions)";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditUser: FC<Props> = async ({ params }) => {
  const session = await auth();
  const userId = (await params).id;
  const response = await fetchUserAction(userId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/users?error=${encodeURIComponent(response.message)}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Editar Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm
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
