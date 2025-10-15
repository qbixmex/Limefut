import { FC } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth.config";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Badge } from "@/root/src/components/ui/badge";
import Link from "next/link";
import { Tournament } from "@/generated/prisma";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { fetchTournamentAction } from "../(actions)";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

export const TournamentPage: FC<Props> = async ({ params }) => {
  const session = await auth();
  const permalink = (await params).permalink;

  const response = await fetchTournamentAction(permalink, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/torneos?error=${encodeURIComponent(response.message)}`);
  }

  const tournament = response.tournament as Tournament;

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800 relative">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              <h1 className="text-xl font-bold">Detalles del Torneo</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
              <div className="w-full lg:w-1/2">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Nombre</TableHead>
                      <TableCell>{tournament.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold">Temporada</TableHead>
                      <TableCell>{tournament.season}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold">Descripción</TableHead>
                      <TableCell>{tournament.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold">País</TableHead>
                      <TableCell>{tournament.country}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold">Estado</TableHead>
                      <TableCell>{tournament.state}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold">City</TableHead>
                      <TableCell>{tournament.city}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="w-full lg:w-1/2">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-semibold">Descripción</TableHead>
                      <TableCell>{tournament.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">Fecha de Inicio</TableHead>
                      <TableCell>
                        {format(new Date(tournament.startDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">Fecha Final</TableHead>
                      <TableCell>
                        {format(new Date(tournament.endDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">Fecha de Creación</TableHead>
                      <TableCell>
                        {format(new Date(tournament?.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">Última actualización</TableHead>
                      <TableCell>
                        {format(new Date(tournament?.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-medium w-[180px]">Activo</TableHead>
                      <TableCell>
                        {
                          tournament.active
                            ? <Badge variant="outline-info">Activo</Badge>
                            : <Badge variant="outline-warning">No Activo</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/torneos/editar/${tournament.permalink}`}>
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

export default TournamentPage;