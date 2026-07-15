import type { FC } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Table, TableBody, TableHead, TableCell, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fetchTournamentAction, type TOURNAMENT_TYPE } from '../(actions)';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { headers } from 'next/headers';
import { DeleteTournamentImage } from '../(components)/delete-tournament-image';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  paramsPromise: Promise<{
    id: string;
  }>;
}>;

export const TournamentView: FC<Props> = async ({ paramsPromise }) => {
  const tournamentId = (await paramsPromise).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const response = await fetchTournamentAction(tournamentId, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`${ROUTES.ADMIN_TOURNAMENTS}?error=${encodeURIComponent(response.message)}`);
  }

  const tournament = response.tournament as TOURNAMENT_TYPE;

  return (
    <div data-testid="tournament-details">
      <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
        <div className="w-full xl:max-w-lg flex justify-center">
          {
            !tournament.imageUrl ? (
              <div className="bg-gray-200 dark:bg-gray-800 w-full max-w-[512px] h-auto rounded-xl flex items-center justify-center">
                <Trophy
                  size={512}
                  strokeWidth={1}
                  className="stroke-gray-400"
                  role="img"
                  aria-label="Icono de trofeo"
                />
              </div>
            ) : (
              <div className="w-full">
                <div className="w-full max-w-[512px] h-auto relative">
                  <Image
                    src={tournament.imageUrl}
                    width={512}
                    height={512}
                    alt={tournament.name}
                    className="w-full max-w-[512px] h-auto rounded-lg object-cover"
                    aria-label="Imagen del torneo"
                  />
                  <DeleteTournamentImage
                    teamId={tournament.id}
                    roles={session?.user.roles as string[]}
                    className="absolute top-2 right-2"
                  />
                </div>
              </div>
            )
          }
        </div>

        <div className="w-full">
          <div className="w-full flex flex-col gap-0 lg:flex-row lg:gap-5 mb-5">
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className="w-auto md:w-28 font-semibold">Nombre</TableHead>
                  <TableCell>
                    <p className="text-wrap">{tournament.name}</p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-semibold">
                    <p className="text-wrap">Enlace Permanente</p>
                  </TableHead>
                  <TableCell>
                    <p className="whitespace-break-spaces">{tournament.permalink}</p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="w-auto md:w-28 font-semibold">País</TableHead>
                  <TableCell>
                    <span role="text" aria-label="País del torneo">
                      {tournament.country ?? 'No disponible'}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-semibold">Temporada</TableHead>
                  <TableCell>
                    <span role="text" aria-label="Temporada del torneo">
                      {tournament.season ?? 'No disponible'}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-semibold">
                    Ciudades
                  </TableHead>
                  <TableCell>
                    <p
                      className="text-wrap"
                      role="text"
                      aria-label="Ciudades del torneo"
                    >
                      {
                        (tournament.cities.length > 0)
                          ? tournament.cities.join(', ')
                          : 'No disponibles'
                      }
                    </p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-semibold">
                    <p className="text-wrap">Fecha Inicial</p>
                  </TableHead>
                  <TableCell>
                    <span
                      className="text-pretty"
                      role="text"
                      aria-label="Fecha inicial"
                    >
                      {format(new Date(tournament.startDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-semibold">Fecha Final</TableHead>
                  <TableCell>
                    <span
                      className="text-pretty"
                      role="text"
                      aria-label="Fecha final"
                    >
                      {format(new Date(tournament.endDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-medium">Activo</TableHead>
                  <TableCell>
                    {
                      tournament.active
                        ? (
                          <Badge
                            variant="outline-info"
                            role="status"
                            aria-label="Torneo activo"
                          >activo</Badge>
                        )
                        : (
                          <Badge
                            variant="outline-secondary"
                            role="status"
                            aria-label="Torneo desactivado"
                          >desactivado</Badge>
                        )
                    }
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-500 mb-2">Descripción</p>
        {tournament.description ? (
          <p
            className="text-pretty"
            aria-label="Descripción del torneo"
          >{tournament.description}</p>
        ) : (
          <Badge
            variant="outline-secondary"
            role="status"
            aria-label="Descripción del torneo"
          >No suministrada</Badge>
        )}
      </section>

      <section className="mb-5">
        <h2 className="text-lg font-semibold text-emerald-600 dark:text-emerald-500 mb-5">
          Categorías{' '}
          <span
            className="text-gray-500 text-base font-semibold"
          >
            ({tournament.categories.length})
          </span>
        </h2>

        <div className="flex flex-wrap gap-2">
          {(tournament.categories.length > 0) && (
            tournament.categories.map((category) => (
              <Badge
                key={category.id}
                variant="outline-info"
                role="status"
                aria-label={category.name}
              >
                {category.name}
              </Badge>
            ))
          )}

          {(tournament.categories.length === 0) && (
            <Badge
              variant="outline-secondary"
              role="status"
              aria-label="Sin categorías"
            >
              No disponibles
            </Badge>
          )}
        </div>
      </section>
    </div>
  );
};
