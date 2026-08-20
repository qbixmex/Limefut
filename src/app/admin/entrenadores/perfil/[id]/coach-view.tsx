import type { FC } from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { fetchCoachDetailsAction } from '../../(actions)';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { GiWhistle } from 'react-icons/gi';
import { DeleteCoachImage } from '../../(components)/delete-coach-image';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const CoachView: FC<Props> = async ({ params }) => {
  const coachId = (await params).id;

  const response = await fetchCoachDetailsAction(coachId);

  if (!response.ok) {
    redirect(`/admin/entrenadores?error=${encodeURIComponent(response.message)}`);
  }

  const coach = response.coach!;

  return (
    <>
      <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
        {
          !coach.imageUrl ? (
            <div className="bg-gray-200 dark:bg-gray-800 size-[512px] rounded-xl flex items-center justify-center">
              <GiWhistle size={512} strokeWidth={1} className="text-gray-400" />
            </div>
          ) : (
            <div className="w-full">
              <div className="w-full max-w-[512px] h-auto relative">
                <Image
                  src={coach.imageUrl}
                  width={512}
                  height={512}
                  alt={`imagen de perfil de ${coach.name}`}
                  className="rounded-lg size-[512px] object-cover"
                />
                <DeleteCoachImage
                  coachId={coach.id}
                  className="absolute top-2 right-2"
                />
              </div>
            </div>
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

      <section>
        <h2 className="text-2xl font-semibold mb-2">
          Equipo{coach.teams.length > 1 ? 's' : ''}
        </h2>

        <div className="flex flex-wrap gap-2">
          {
            coach.teams.map((team) => (
              <Link key={team.id} href={`/admin/equipos/${team.id}`}>
                <Badge variant="outline-info">
                  <span>{team.name},</span>
                  <span>{team.category?.name}</span>
                </Badge>
              </Link>
            ))
          }
        </div>
      </section>

      <div className="absolute top-5 right-5">
        <Tooltip>
          <TooltipTrigger>
            <Link
              href={ROUTES.ADMIN_COACHES_EDIT(coach.id)}
              className={
                buttonVariants({
                  variant: 'outline-warning',
                  size: 'icon',
                })
              }
            >
              <Pencil />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>editar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};
