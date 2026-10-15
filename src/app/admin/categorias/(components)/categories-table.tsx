import type { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/shared/components/pagination';
import { Pagination as PAGINATION_TYPE } from '@/shared/interfaces';
import { EditCategory } from './edit-category';
import { fetchCategoriesAction, type CATEGORY_TYPE } from '../(actions)/fetch-categories.action';
import { DeleteCategory } from './delete-category';
import { EmptyMessageResource } from '@/shared/components/empty-message-resource';
import { ErrorMessageResource } from '@/shared/components/error-message-resource';

type Props = Readonly<{
  query: string;
  currentPage: string;
}>;

export const CategoriesTable: FC<Props> = async ({ query, currentPage }) => {
  const response = await fetchCategoriesAction({
    page: Number(currentPage),
    take: 12,
    searchTerm: query,
  });

  if (!response.ok) {
    return (
      <ErrorMessageResource>
        {response.message}
      </ErrorMessageResource>
    );
  }

  const categories = response.categories as CATEGORY_TYPE[];
  const pagination = response.pagination as PAGINATION_TYPE;

  return (
    <>
      {categories && categories.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table aria-label="Tabla de categorías">
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Enlace Permanente</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
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
                        <DeleteCategory categoryId={category.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {(pagination.totalPages > 1) && (
            <div className="flex justify-center mt-10">
              <Pagination totalPages={pagination.totalPages as number} />
            </div>
          )}
        </div>
      ) : (
        <EmptyMessageResource>
          Aún no hay categorías creadas
        </EmptyMessageResource>
      )}
    </>
  );
};
