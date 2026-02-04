import type { FC } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Mail } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { fetchMessageAction } from "../(actions)/fetchMessageAction";
import { ActiveSwitch } from "@/shared/components/active-switch";
import { updateMessageStatusAction } from "../(actions)/updateMessageStatusAction";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const MessagePage: FC<Props> = async ({ params }) => {
  const session = await auth();
  const id = (await params).id;

  const response = await fetchMessageAction(id, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/mensajes?error=${encodeURIComponent(response.message)}`);
  }

  const message = response.contactMessage!;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles del Mensaje</CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
              <div className="bg-gray-200 dark:bg-gray-800 size-[512px] rounded-xl flex items-center justify-center">
                <Mail size={480} strokeWidth={1} className="stroke-gray-400" />
              </div>
              <div>
                <Table className="mb-10">
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
                          {message.read
                            ? <span className="text-emerald-500">Si</span>
                            : <span className="text-amber-500">No</span>
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div>
                  <h2 className="text-lg text-sky-600 font-bold">Mensaje</h2>
                  <p className="italic">{message.message}</p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagePage;