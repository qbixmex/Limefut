import { Suspense, type FC } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { fetchCoachAction } from "../../(actions)";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GiWhistle } from "react-icons/gi";
import { headers } from "next/headers";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const CoachPage: FC<Props> = async ({ params }) => {
  return (
    <Suspense>
      <CoachPageContent params={params} />
    </Suspense>
  );
};

const CoachPageContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const coachId = (await params).id;

  const response = await fetchCoachAction(coachId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/entrenadores?error=${encodeURIComponent(response.message)}`);
  }

  const coach = response.coach!;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles del Entrenador</CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
              {
                !coach.imageUrl ? (
                  <div className="bg-gray-200 dark:bg-gray-800 size-[512px] rounded-xl flex items-center justify-center">
                    <GiWhistle size={480} strokeWidth={1} className="text-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={coach.imageUrl}
                    width={512}
                    height={512}
                    alt={`imagen de perfil de ${coach.name}`}
                    className="rounded-lg size-[512px] object-cover"
                  />
                )
              }
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-semibold w-[180px]">Nombre Completo</TableHead>
                    <TableCell>{coach.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Correo Electrónico</TableHead>
                    <TableCell>{coach.email ?? 'No Proporcionado'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Teléfono</TableHead>
                    <TableCell>{coach.phone ?? 'No Proporcionado'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Edad</TableHead>
                    <TableCell>{coach.age ?? 'No Proporcionado'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Nacionalidad</TableHead>
                    <TableCell>{coach.nationality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Descripción</TableHead>
                    <TableCell className="whitespace-break-spaces">{coach.description ?? 'No proporcionada'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Equipo{coach.teams.length > 1 ? 's' : ''}</TableHead>
                    <TableCell className="flex flex-wrap gap-2">
                      {
                        coach.teams.map((team) => (
                          <Link key={team.id} href={`/admin/equipos/${team.permalink}`}>
                            <Badge variant="outline-info">{team.name}</Badge>
                          </Link>
                        ))
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">Fecha de creación</TableHead>
                    <TableCell>
                      {format(new Date(coach?.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">Última Actualización</TableHead>
                    <TableCell>
                      {format(new Date(coach?.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium w-[180px]">Estado</TableHead>
                    <TableCell>
                      {
                        coach.active
                          ? <Badge variant="outline-info">Activo</Badge>
                          : <Badge variant="outline-warning">No Activo</Badge>
                      }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/entrenadores/editar/${coach.id}`}>
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

export default CoachPage;