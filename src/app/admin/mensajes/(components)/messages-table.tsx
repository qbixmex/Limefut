import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/get-session';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/shared/components/pagination';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fetchMessagesAction } from '../(actions)/fetchMessagesAction';
import { DeleteMessage } from './delete-message';
import { updateMessageStatusAction } from '../(actions)/updateMessageStatusAction';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { EmptyMessageResource } from '@/shared/components/empty-message-resource';
import { MessageDetails } from './message-details';

type Props = Readonly<{
  query: string;
  currentPage: string;
}>;

export const MessagesTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await getSession();
  const {
    messages = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchMessagesAction({
    page: Number(currentPage),
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
                  <TableHead className="w-[100px]">Leído</TableHead>
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
                    <TableCell>
                      {format(message.createdAt as Date, "EEEE dd 'de' MMMM, yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-5">
                        <ActiveSwitch
                          resource={{ id: message.id as string, state: message.read }}
                          updateResourceStateAction={updateMessageStatusAction}
                        />
                        {
                          message.read
                            ? <span className="text-emerald-500">Si</span>
                            : <span className="text-amber-500">No</span>
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <MessageDetails messageId={message.id as string} />
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
          <div
            className={cn('flex justify-center mt-10', {
              hidden: pagination!.totalPages === 1,
            })}
          >
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <EmptyMessageResource>
          No hay mensajes en la bandeja
        </EmptyMessageResource>
      )}
    </>
  );
};

export default MessagesTable;
