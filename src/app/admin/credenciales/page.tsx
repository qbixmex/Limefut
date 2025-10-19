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
  Pencil,
  InfoIcon,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { DeleteCredential } from "./(components)/delete-credential";
import { fetchCredentialsAction } from "./(actions)";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { auth } from "@/auth.config";
import { Badge } from "@/root/src/components/ui/badge";

export const CredentialsPage = async () => {
  const response = await fetchCredentialsAction();
  const credentials = response.credentials;

  const session = await auth();

  return (
    <>
      <ErrorHandler />
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Lista de Credenciales</CardTitle>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/credenciales/crear">
                      <Button variant="outline-primary" size="icon">
                        <Plus strokeWidth={3} />
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
              {credentials && credentials.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Nombre Completo</TableHead>
                      <TableHead className="w-[200px] text-center">CURP</TableHead>
                      <TableHead className="w-[120px] text-left lg:text-center">No. Camiseta</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {credentials.map((credential) => (
                      <TableRow key={credential.id}>
                        <TableCell>{credential.fullName}</TableCell>
                        <TableCell>{credential.curp}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline-info">{credential.jerseyNumber}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-3">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/admin/credenciales/detalles/${credential.id}`}>
                                  <Button variant="outline-info" size="icon">
                                    <InfoIcon />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                detalles
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/admin/credenciales/editar/${credential.id}`}>
                                  <Button variant="outline-warning" size="icon">
                                    <Pencil />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>editar</p>
                              </TooltipContent>
                            </Tooltip>
                            <DeleteCredential
                              id={credential.id}
                              roles={session?.user.roles as string[]}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="bg-sky-600 p-5 rounded">
                  <p className="text-center text-xl font-bold">Todavía no hay credenciales creadas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CredentialsPage;