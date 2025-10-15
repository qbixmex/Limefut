import { FC } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserAction } from "../../(actions)/fetchUserAction";
import { auth } from "@/auth.config";
import Image from "next/image";
import { type User } from "@/root/next-auth";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Pencil, UserIcon } from "lucide-react";
import { Badge } from "@/root/src/components/ui/badge";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const UserProfilePage: FC<Props> = async ({ params }) => {
  const session = await auth();
  const userId = (await params).id;

  const response = await fetchUserAction(userId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/users?error=${encodeURIComponent(response.message)}`);
  }

  const user = response.user as User;

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800 relative">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              <h1 className="text-xl font-bold text-green-500">
                Perfil de Usuario
              </h1>
            </CardTitle>
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
                  <Link href={`/admin/users/edit/${user.id}`}>
                    <Button variant="outline-warning" size="icon">
                      <Pencil />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>editar</p>
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