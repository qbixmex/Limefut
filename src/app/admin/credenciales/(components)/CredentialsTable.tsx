import { type FC } from "react";
import { Button } from "@/components/ui/button";
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
import { Pencil, InfoIcon } from "lucide-react";
import Link from "next/link";
import { DeleteCredential } from "../(components)/delete-credential";
import { fetchCredentialsAction } from "../(actions)";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/shared/components/pagination";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

type Props = Readonly<{
  query: string;
  currentPage: string;
}>;

export const CredentialsTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const {
    credentials = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchCredentialsAction({
    page: Number(currentPage),
    take: 8,
    searchTerm: query,
  });

  return (
    <>
      {credentials && credentials.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
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
          </div>
          <div className={cn("flex justify-center mt-10", {
            'hidden': pagination!.totalPages === 1,
          })}>
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No hay credenciales
          </p>
        </div>
      )}
    </>
  );
};

export default CredentialsTable;
