import type { FC } from 'react';
import { redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Mail } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fetchMessageAction } from '../(actions)/fetchMessageAction';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { updateMessageStatusAction } from '../(actions)/updateMessageStatusAction';
import { ROUTES } from '@/shared/constants/routes';
import styles from './styles.module.css';

type Props = Readonly<{
  params: Promise<{ id: string }>;
}>;

export const ContactMessageView: FC<Props> = async ({ params }) => {
  const id = (await params).id;

  const response = await fetchMessageAction(id);

  if (!response.ok) {
    redirect(`${ROUTES.ADMIN_MESSAGES}?error=${encodeURIComponent(response.message)}`);
  }

  const message = response.contactMessage!;

  return (
    <>
      <section className={styles.contactMessageView}>
        <figure className={styles.figure}>
          <Mail size={200} strokeWidth={1} className="stroke-gray-400" />
        </figure>
        <div>
          <Table aria-label="Detalles del mensaje">
            <TableBody>
              <TableRow>
                <TableHead className="font-semibold w-[180px]">Nombre</TableHead>
                <TableCell>{message.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Email</TableHead>
                <TableCell>{message.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="w-[180px] font-semibold">Fecha</TableHead>
                <TableCell>
                  {format(new Date(message?.createdAt as Date), "EEEE dd 'de' MMMM, yyyy", { locale: es })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Leído</TableHead>
                <TableCell className="italic font-bold">
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
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
      <section>
        <h2 className={styles.messageTitle}>Mensaje</h2>
        <p className={styles.messageText}>{message.message}</p>
      </section>
    </>
  );
};
