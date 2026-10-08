import { type FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSession } from '@/lib/get-session';
import { fetchPagesAction } from '../(actions)/fetchPagesAction';
import { SeoRobots } from './seo-robots';
import type { ROBOTS } from '@/shared/interfaces';
import { Pagination } from '@/shared/components/pagination';
import { cn, getPageStatus } from '@/lib/utils';
import { DeletePage } from './delete-page';
import { Badge } from '@/components/ui/badge';
import type { PAGE_STATUS } from '@/shared/interfaces/Page';
import { EmptyMessageResource } from '@/shared/components/empty-message-resource';
import { ShowCustomPageDetails } from './show-custom-page-details';
import { EditCustomPage } from './edit-custom-page';

type Props = Readonly<{
  query?: string;
  currentPage?: string;
}>;

export const PagesTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {
  const session = await getSession();

  const {
    customPages = [],
    pagination,
  } = await fetchPagesAction({
    page: currentPage as number,
    take: 12,
    searchTerm: query,
  });

  return (
    <>
      {customPages.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Enlace Permanente</TableHead>
                  <TableHead className="w-25">Robots</TableHead>
                  <TableHead className="w-25 text-center">Estado</TableHead>
                  <TableHead className="w-25 text-center">Posición</TableHead>
                  <TableHead className="w-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customPages.map((page) => {
                  const pageStatus = getPageStatus(page.status as PAGE_STATUS);
                  return (
                    <TableRow key={page.id}>
                      <TableCell>
                        {
                          page.title ? (
                            <p className="text-pretty">{page.title}</p>
                          ) : (
                            <Badge variant="outline-secondary">
                              No especificado
                            </Badge>
                          )
                        }
                      </TableCell>
                      <TableCell>
                        {
                          page.permalink ? (
                            <p className="text-pretty">{page.permalink}</p>
                          ) : (
                            <Badge variant="outline-secondary">
                              No especificado
                            </Badge>
                          )
                        }
                      </TableCell>
                      <TableCell>
                        <SeoRobots robots={page.seoRobots as ROBOTS} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={pageStatus.variant}>
                          {pageStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline-info">{page.position}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3">
                          <ShowCustomPageDetails pageId={page.id} />
                          <EditCustomPage pageId={page.id} />
                          <DeletePage
                            pageId={page.id as string}
                            roles={session?.user.roles as string[]}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
        <EmptyMessageResource>
          No hay páginas disponibles
        </EmptyMessageResource>
      )}
    </>
  );
};
