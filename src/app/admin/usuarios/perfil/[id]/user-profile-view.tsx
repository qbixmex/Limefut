import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchUserAction } from '../../(actions)/fetchUserAction';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Pencil, UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import type { User } from '../../(services)/fetch-user.api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Icon } from '@iconify/react';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const UserProfileView: FC<Props> = async ({ params }) => {
  const userId = (await params).id;
  const response = await fetchUserAction(userId);

  if (!response.ok && response.message) {
    redirect(`${ROUTES.ADMIN_USERS}?error=${encodeURIComponent(response.message)}`);
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
                          ? (
                            <Badge variant="outline-success" asChild>
                              <Icon icon="lucide:check" style={{ fontSize: 24 }} />
                            </Badge>
                          )
                          : (
                            <Badge variant="outline-secondary" asChild>
                              <Icon icon="lucide:x" style={{ fontSize: 24 }} />
                            </Badge>
                          )
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium">Email Verificado</TableHead>
                    <TableCell>
                      {
                        user.emailVerified
                          ? (
                            <Badge variant="outline-success" asChild>
                              <Icon icon="lucide:check" style={{ fontSize: 24 }} />
                            </Badge>
                          )
                          : (
                            <Badge variant="outline-secondary" asChild>
                              <Icon icon="lucide:x" style={{ fontSize: 24 }} />
                            </Badge>
                          )
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium">Fecha de creación</TableHead>
                    <TableCell>{format(user.createdAt, "d 'de' LLLL", { locale: es })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium">Fecha de actualización</TableHead>
                    <TableCell>{format(user.updatedAt, "d 'de' LLLL", { locale: es })}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>
            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={ROUTES.ADMIN_USERS_EDIT(user.id)}
                    className={buttonVariants({
                      variant: 'outline-warning',
                      size: 'icon',
                    })}
                  >
                    <Pencil />
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
