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
import { DeleteResource } from "../(components)/delete-resource";

const users = [
  {
    id: '2ea39b30-ea30-4bcc-82c2-f42ba68b42e9',
    name: "Daniel González Briseño",
    email: "qbixmex@gmail.com",
    type: "admin",
    active: true,
  },
  {
    id: '1b2b3243-159b-48e1-a9fb-c871cec0134e',
    name: "Moises Rodriguez Ramirez",
    email: "moy@gmail.com",
    type: "admin",
    active: true,
  },
  {
    id: '438d90d3-f7c1-48c6-b0fd-dd308cdc6cfc',
    name: "Alejandro Cordoba Perez",
    email: "alex@gmail.com",
    type: "user",
    active: false,
  },
];

export const UsersPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full bg-linear-to-br from-zinc-950 to-zinc-800 shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Lista de Usuarios</CardTitle>
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline-primary" size="icon">
                    <Link href="/admin/users/create">
                      <File />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>crear</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nombre</TableHead>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="w-[100px]">Tipo</TableHead>
                  <TableHead className="w-[100px] text-center">Activo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(({ id, name, email, type, active }) => (
                  <TableRow key={id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>
                      {(type === 'admin' && 'Administrador') || (type === 'user' && 'Usuario')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={active ? 'outline-success' : 'outline-secondary'}>
                        {active ? <Check /> : <CircleOff />}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline-warning" size="icon">
                            <Link href={`/admin/users/${id}`}>
                              <Pencil />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>editar</p>
                        </TooltipContent>
                      </Tooltip>
                      <DeleteResource label="usuario" resourceId={id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersPage;