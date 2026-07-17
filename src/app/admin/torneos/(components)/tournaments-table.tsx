import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { fetchTournamentsAction, updateTournamentStateAction } from '../(actions)';
import { auth } from '@/lib/auth';
import { DeleteTournament } from './delete-tournament';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { Badge } from '@/components/ui/badge';
import { headers } from 'next/headers';
import { ShowTournamentDetails } from './show-tournament-details';
import { EditTournament } from './edit-tournament';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  query: string;
  currentPage: string;
}>;

export const TournamentsTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {
    ok,
    message,
    tournaments = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchTournamentsAction({
    page: Number(currentPage),
    take: 12,
    searchTerm: query,
  });

  if (!ok) {
    return (
      <div className="border border-red-500 p-5 rounded">
        <p className="text-red-500 text-center text-xl font-semibold">
          {message}
        </p>
      </div>
    );
  }

  return (
    <>
      {tournaments && tournaments.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table aria-label="Tabla de datos">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] hidden lg:table-cell">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden lg:table-cell w-25 text-center">Temporada</TableHead>
                  <TableHead className="hidden lg:table-cell w-25 text-center">Categorías</TableHead>
                  <TableHead className="hidden lg:table-cell w-25">Fecha Inicial</TableHead>
                  <TableHead className="hidden lg:table-cell w-25">Fecha Final</TableHead>
                  <TableHead className="hidden lg:table-cell text-center">Activo</TableHead>
                  <TableHead>&nbsp;</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="hidden lg:table-cell">
                      <Link
                        href={ROUTES.ADMIN_TOURNAMENTS_SHOW(tournament.id)}
                        aria-label={`Enlace a ${tournament.name}`}
                      >
                        {
                          !tournament.imageUrl ? (
                            <figure className="border border-gray-400 dark:border-0 dark:bg-gray-800 size-[60px] rounded-lg flex items-center justify-center">
                              <Trophy size={35} className="stroke-gray-400" />
                            </figure>
                          ) : (
                            <Image
                              src={tournament.imageUrl}
                              alt={`${tournament.name} picture`}
                              width={75}
                              height={75}
                              className="size-18 rounded-xl object-cover"
                            />
                          )
                        }
                      </Link>
                    </TableCell>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      {tournament.season}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <Badge
                        variant={
                          (tournament.categoriesQuantity > 0)
                            ? 'outline-info'
                            : 'outline-secondary'
                        }
                        role="status"
                        aria-label={`${tournament.categoriesQuantity} categorías`}
                      >
                        {tournament.categoriesQuantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(tournament.startDate, "EEE d MMM',' y", { locale: es })}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(tournament.endDate, "EEE d MMM',' y", { locale: es })}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <ActiveSwitch
                        resource={{ id: tournament.id, state: tournament.active }}
                        updateResourceStateAction={updateTournamentStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <ShowTournamentDetails tournamentId={tournament.id} />
                        <EditTournament paramsPromise={Promise.resolve({ id: tournament.id })} />
                        <DeleteTournament
                          tournamentId={tournament.id}
                          roles={session?.user.roles as string[] ?? null}
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
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            Aún no hay torneos creados
          </p>
        </div>
      )}
    </>
  );
};
