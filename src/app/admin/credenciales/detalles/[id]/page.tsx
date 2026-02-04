import type { FC } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { IdCardIcon, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { fetchCredentialAction } from "../../(actions)";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const CredentialPage: FC<Props> = async ({ params }) => {
  const session = await auth();
  const id = (await params).id;

  const response = await fetchCredentialAction(id, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/credentials?error=${encodeURIComponent(response.message)}`);
  }

  const credential = response.credential;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles de la Credencial</CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
              {
                !credential?.player.imagePublicID ? (
                  <div className="bg-gray-200 dark:bg-gray-800 size-[512px] rounded-xl flex items-center justify-center">
                    <IdCardIcon size={480} strokeWidth={1} className="text-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={credential.player.imagePublicID}
                    width={512}
                    height={512}
                    alt={`Jugador ${credential?.player.name}`}
                    className="rounded-lg size-[512px] object-cover"
                  />
                )
              }
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-semibold">Nombre Completo</TableHead>
                    <TableCell>{credential?.fullName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Fecha de Nacimiento</TableHead>
                    <TableCell>
                      {format(new Date(credential?.birthdate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">CURP</TableHead>
                    <TableCell>{credential?.curp}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Posición</TableHead>
                    <TableCell>{credential?.position}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">No. de camiseta</TableHead>
                    <TableCell>
                      <Badge variant="outline-info">{credential?.jerseyNumber}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Torneo</TableHead>
                    <TableCell>{credential?.tournament.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Equipo</TableHead>
                    <TableCell>{credential?.player.team.name}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/credenciales/editar/${credential?.id}`}>
                    <Button variant="outline-warning" size="icon">
                      <Pencil />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>editar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CredentialPage;