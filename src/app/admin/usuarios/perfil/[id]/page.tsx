import { Suspense, type FC } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserAction } from "../../(actions)/fetchUserAction";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Pencil, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { type User } from "@/shared/interfaces";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const UserProfilePage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <UserProfileContent params={params} />
    </Suspense>
  );
};

const UserProfileContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = (await params).id;
  const response = await fetchUserAction(
    userId,
    session?.user.roles as string[],
  );

  if (!response.ok) {
    redirect(`/admin/users?error=${encodeURIComponent(response.message)}`);
  }

  const user = response.user as User;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Perfil de Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 xl:flex-row lg:gap-10">
              {
                !user.imageUrl ? (
                  <div className="bg-gray-200 dark:bg-gray-800 size-[512px] rounded-xl flex items-center justify-center">
                    <UserIcon size={480} strokeWidth={1} className="stroke-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={user.imageUrl}
                    width={512}
                    height={512}
                    alt={`imagen de perfil de ${user.name}`}
                    className="rounded-lg size-[512px] object-cover"
                  />
                )
              }
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-medium w-[180px]">Nombre Completo</TableHead>
                    <TableCell>{user.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium w-[180px]">Nombre de Usuario</TableHead>
                    <TableCell>{user.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium">Correo Electrónico</TableHead>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium">Roles</TableHead>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((role) => (
                          <Badge key={role} variant="outline-info">{role}</Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium w-[180px]">Estado</TableHead>
                    <TableCell>
                      {
                        user.isActive
                          ? <Badge variant="outline-info">Activo</Badge>
                          : <Badge variant="outline-warning">No Activo</Badge>
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium">Verificado</TableHead>
                    <TableCell>
                      {
                        user.emailVerified
                          ? <Badge variant="outline-info">Verificado</Badge>
                          : <Badge variant="outline-warning">No Verificado</Badge>
                      }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>
            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/usuarios/editar/${user.id}`}>
                    <Button variant="outline-warning" size="icon">
                      <Pencil />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <span>editar</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;