import type { FC } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { auth } from '@/auth';
import { updatePageStateAction } from '../(actions)/updatePageStateAction';
import { fetchPagesAction } from '../(actions)/fetchPagesAction';
import { SeoRobots } from './seo-robots';
import type { Robots } from '@/shared/interfaces';

type Props = Readonly<{
  query?: string;
  currentPage?: string;
}>;

export const PagesTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {
  const session = await auth();

  const {
    customPages = [],
    pagination,
  } = await fetchPagesAction({
    userRole: session?.user.roles ?? [],
    page: currentPage as number,
    take: 8,
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
                  <TableHead className="w-25 text-center">Activo</TableHead>
                  <TableHead className="w-[200px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <p className="text-pretty">{page.title}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-pretty">{page.permalink}</p>
                    </TableCell>
                    <TableCell>
                      <SeoRobots robots={page.seoRobots as Robots} />
                    </TableCell>
                    <TableCell className="text-center">
                      <ActiveSwitch
                        resource={{ id: page.id as string, state: page.active }}
                        updateResourceStateAction={updatePageStateAction}
                      />
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
                        {/* <DeletePage
                          galleryId={gallery.id}
                          roles={session?.user.roles as string[]}
                        /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* <div className={cn("flex justify-center mt-10", {
            'hidden': pagination!.totalPages === 1,
          })}>
            <Pagination totalPages={pagination!.totalPages as number} />
          </div> */}
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

export default PagesTable;
