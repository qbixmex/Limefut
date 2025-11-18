import type { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { auth } from '@/auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info } from "lucide-react";
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { TooltipContent } from '@/components/ui/tooltip';
import Pagination from '@/shared/components/pagination';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fetchMessagesAction } from '../(actions)/fetchMessagesAction';
import { DeleteMessage } from './delete-message';

type Props = Readonly<{
  query: string;
  currentPage: number;
}>;

export const MessagesTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await auth();
  const {
    messages = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchMessagesAction({
    userRoles: session?.user.roles as string[],
    page: currentPage,
    take: 12,
    searchTerm: query,
  });

  return (
    <>
      {messages && messages.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nombre</TableHead>
                  <TableHead className="w-[250px]">Email</TableHead>
                  <TableHead className="w-[120px]">Mensaje</TableHead>
                  <TableHead className="w-[100px] text-center">Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>
                      {
                        (message.message.length >= 50)
                          ? message.message.substring(0, 50) + ' ...'
                          : message.message
                      }
                    </TableCell>
                    <TableCell>{format(message.createdAt as Date, "EEEE dd 'de' MMMM, yyyy", { locale: es })}</TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/mensajes/${message.id}`}>
                              <Button variant="outline-info" size="icon">
                                <Info />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>detalles</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteMessage
                          id={message.id as string}
                          roles={session?.user?.roles ?? []}
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
            No hay mensajes
          </p>
        </div>
      )}
    </>
  );

};

export default MessagesTable;
