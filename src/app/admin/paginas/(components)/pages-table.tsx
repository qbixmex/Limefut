import { type FC } from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { fetchPagesAction } from '../(actions)/fetchPagesAction';
import { SeoRobots } from './seo-robots';
import type { ROBOTS } from '@/shared/interfaces';
import { Pagination } from '@/shared/components/pagination';
import { cn, getPageStatus } from '@/lib/utils';
import { DeletePage } from './delete-page';
import { Badge } from '@/components/ui/badge';
import type { PAGE_STATUS } from '@/shared/interfaces/Page';

type Props = Readonly<{
  query?: string;
  currentPage?: string;
}>;

export const PagesTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {
    customPages = [],
    pagination,
  } = await fetchPagesAction({
    userRole: session?.user.roles ?? [],
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
                        <p className="text-pretty">{page.title ?? 'No especificado'}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-pretty">{page.permalink ?? 'No especificado'}</p>
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/admin/paginas/${page.id}`}>
                                <Button variant="outline-info" size="icon">
                                  <InfoIcon />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              detalles
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/admin/paginas/editar/${page.id}`}>
                                <Button variant="outline-warning" size="icon">
                                  <Pencil />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>editar</p>
                            </TooltipContent>
                          </Tooltip>
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
          <div className={cn("flex justify-center mt-10", {
            'hidden': pagination!.totalPages === 1,
          })}>
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No hay páginas disponibles
          </p>
        </div>
      )}
    </>
  );
};
