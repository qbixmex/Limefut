import type { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// import { fetchTournamentsAction, updateTournamentStateAction } from '../(actions)';
import { auth } from '@/lib/auth';
// import { DeleteTournament } from './delete-category';
import { cn } from '@/lib/utils';
import { headers } from 'next/headers';
import type { Category, Pagination as PaginationType } from '@/shared/interfaces';
import { Pagination } from '@/shared/components/pagination';
import { EditCategory } from './edit-category';
import { fetchCategoriesAction } from '../(actions)/fetch-categories.action';

type Props = Readonly<{
  query: string;
  currentPage: string;
}>;

export const CategoriesTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {
    categories = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchCategoriesAction({
    page: Number(currentPage),
    take: 12,
    searchTerm: query,
  });

  return (
    <>
      {categories && categories.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Enlace Permanente</TableHead>
                  <TableHead className="w-[150px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell className="hidden lg:table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.permalink}</TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <EditCategory categoryId={category.id as string} />
                        {/* <DeleteCategory
                          tournamentId={tournament.id}
                          roles={session?.user.roles as string[] ?? null}
                        /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={cn('flex justify-center mt-10', {
            hidden: pagination!.totalPages === 1,
          })}>
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            Aún No hay categorías
          </p>
        </div>
      )}
    </>
  );
};
