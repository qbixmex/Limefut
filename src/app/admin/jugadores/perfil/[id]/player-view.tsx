import type { FC } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { fetchPlayerAction } from '../../(actions)';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SoccerPlayer } from '@/shared/components/icons';
import { headers } from 'next/headers';
import { DeletePlayerImage } from '../../(components)/delete-player-image';
import { EditPlayer } from '../../(components)/edit-player';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const PlayerView: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const playerId = (await params).id;

  const response = await fetchPlayerAction(playerId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/jugadores?error=${encodeURIComponent(response.message)}`);
  }

  const player = response.player!;

  return (
    <section
      className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10"
      data-testid="player-content"
    >
      <div className="absolute top-5 right-5">
        <EditPlayer playerId={player.id} />
      </div>
      {
        !player.imageUrl ? (
          <div className="bg-gray-200 dark:bg-gray-800 size-[512px] rounded-xl flex items-center justify-center">
            <SoccerPlayer
              size={512}
              strokeWidth={2}
              className="text-gray-400"
              aria-label="Icono de jugador"
            />
          </div>
        ) : (
          <div className="w-full">
            <div className="w-full max-w-[512px] h-auto relative">
              <Image
                src={player.imageUrl}
                width={512}
                height={512}
                alt={`imagen de perfil de ${player.name}`}
                className="rounded-lg size-[512px] object-cover"
              />
              <DeletePlayerImage
                teamId={player.id}
                roles={session?.user.roles as string[]}
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
            <TableCell>{player.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-semibold">Correo Electrónico</TableHead>
            <TableCell>
              {
                player.email ? (
                  <Badge
                    variant="outline-info"
                    role="status"
                    aria-label="Correo electrónico"
                  >
                    {player.email}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline-secondary"
                    role="status"
                    aria-label="Correo electrónico: no proporcionado"
                  >
                    no proporcionado
                  </Badge>
                )
              }
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-semibold">Teléfono</TableHead>
            <TableCell>
              {
                player.phone ? (
                  <Badge
                    variant="outline-info"
                    role="status"
                    aria-label="Teléfono"
                  >
                    {player.phone}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline-secondary"
                    role="status"
                    aria-label="Teléfono"
                  >
                    no proporcionado
                  </Badge>
                )
              }
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-semibold">Fecha de Nacimiento</TableHead>
            <TableCell>
              {
                player.birthday ? (
                  <Badge
                    variant="outline-info"
                    role="status"
                    aria-label="Fecha de nacimiento"
                  >
                    {
                      format(
                        player.birthday as Date,
                        "d 'de' MMMM 'del' yyyy",
                        { locale: es },
                      )
                    }
                  </Badge>
                ) : (
                  <Badge
                    variant="outline-secondary"
                    role="status"
                    aria-label="Fecha de nacimiento"
                  >
                    no proporcionado
                  </Badge>
                )
              }
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-semibold">Nacionalidad</TableHead>
            <TableCell>{player.nationality}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-semibold">Equipo</TableHead>
            <TableCell>
              {
                (player.team)
                  ? (
                    <Badge
                      variant="outline-info"
                      role="status"
                      aria-label="Equipo"
                    >
                      {player.team?.name}
                    </Badge>
                  )
                  : (
                    <Badge
                      variant="outline-secondary"
                      role="status"
                      aria-label="Equipo"
                    >
                      Sin equipo asignado
                    </Badge>
                  )
              }
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="w-[180px] font-semibold">Fecha de creación</TableHead>
            <TableCell>
              {format(new Date(player?.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="w-[180px] font-semibold">Última Actualización</TableHead>
            <TableCell>
              {format(new Date(player?.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-medium w-[180px]">Estado</TableHead>
            <TableCell>
              {
                player.active
                  ? (
                    <Badge
                      variant="outline-info"
                      role="status"
                      aria-label="Estado del usuario"
                    >
                      activo
                    </Badge>
                  )
                  : (
                    <Badge
                      variant="outline-warning"
                      role="status"
                      aria-label="Estado del usuario"
                    >
                      no activo
                    </Badge>
                  )
              }
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};
