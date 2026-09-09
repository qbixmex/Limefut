import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSession } from '@/lib/get-session';
import { fetchUsersAction, updateUserStateAction } from '../(actions)';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pencil,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DeleteUser } from './delete-user';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Pagination from '@/shared/components/pagination';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants/routes';
import { Icon } from '@iconify/react';

type Props = Readonly<{
  query: string;
  currentPage: string;
}>;

export const UsersTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await getSession();
  const pageNumber = Number(currentPage);
  const options: { page?: number; searchTerm: string } = { searchTerm: query };

  if (Number.isInteger(pageNumber) && pageNumber > 1) {
    options.page = pageNumber;
  }

  const {
    users = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchUsersAction(options);

  return (
    <>
      {users && (users.length > 0) ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-[150px]">Nombre de Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[150px] text-center">Email Verificado</TableHead>
                  <TableHead className="w-[120px]">Roles</TableHead>
                  <TableHead className="w-[100px] text-center">Activo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link href={`/admin/usuarios/perfil/${user.id}`}>
                        {
                          !user.imageUrl ? (
                            <figure className="bg-gray-200 dark:bg-gray-800 size-[60px] rounded-xl flex items-center justify-center">
                              <User size={35} className="stroke-gray-400" />
                            </figure>
                          ) : (
                            <Image
                              src={user.imageUrl}
                              alt={`${user.name} profile picture`}
                              width={75}
                              height={75}
                              className="size-18 rounded-xl object-cover"
                            />
                          )
                        }
                      </Link>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-center">
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
                    <TableCell>
                      <div className="flex gap-2">
                        {user.roles.map((role) => (
                          <Badge key={role} variant="outline-info">{role}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <ActiveSwitch
                        resource={{ id: user.id, state: user.isActive }}
                        updateResourceStateAction={updateUserStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={ROUTES.ADMIN_USERS_SHOW(user.id)}>
                              <Button variant="outline-info" size="icon">
                                <User />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>perfil</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={ROUTES.ADMIN_USERS_EDIT(user.id)}>
                              <Button variant="outline-warning" size="icon">
                                <Pencil />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>editar</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteUser
                          userId={user.id}
                          roles={session?.user.roles as string[]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div
            className={cn('flex justify-center mt-10', {
              hidden: pagination!.totalPages === 1,
            })}
          >
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No hay usuarios
          </p>
        </div>
      )}
    </>
  );
};
