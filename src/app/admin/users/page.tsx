import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  CircleOff,
  File,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DeleteUser } from "../(components)/delete-user";
import { fetchUsersAction } from "./(actions)";
import { ErrorHandler } from "@/root/src/shared/components/errorHandler";
import { auth } from "@/auth.config";

export const UsersPage = async () => {
  const response = await fetchUsersAction();
  const users = response.users;
  const session = await auth();

  return (
    <>
      <ErrorHandler />
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full bg-linear-to-br from-zinc-950 to-zinc-800 shadow-none">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Lista de Usuarios</CardTitle>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/users/create">
                      <Button variant="outline-primary" size="icon">
                        <File />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>crear</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              {users && users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Nombre</TableHead>
                      <TableHead className="w-[200px]">Nombre de Usuario</TableHead>
                      <TableHead className="w-[250px]">Email</TableHead>
                      <TableHead className="w-[120px]">Roles</TableHead>
                      <TableHead className="w-[100px] text-center">Activo</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="flex gap-2">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="outline-secondary">{role}</Badge>
                          ))}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={user.isActive ? 'outline-success' : 'outline-secondary'}>
                            {user.isActive ? <Check /> : <CircleOff />}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex gap-3">
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
                          <DeleteUser
                            userId={user.id}
                            roles={session?.user.roles as string[]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="bg-sky-600 p-5 rounded">
                  <p className="text-center text-xl font-bold">Todavía no hay usuarios creados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UsersPage;