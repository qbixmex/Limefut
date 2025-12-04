import type { FC } from 'react';
import { auth } from '~/src/auth';
import { fetchGalleriesAction } from '../(actions)';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { InfoIcon, Pencil } from 'lucide-react';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale';
// import { ActiveSwitch } from '~/src/shared/components/active-switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pagination } from '@/shared/components/pagination';
import { Badge } from '@/components/ui/badge';

type Props = Readonly<{
  query: string | undefined;
  currentPage: string | undefined;
}>;

export const GalleriesTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {  
  const session = await auth();
  
  const {
    galleries = [],
    pagination,
  } = await fetchGalleriesAction({
    userRole: session?.user.roles ?? [], 
    page: currentPage as number,
    take: 8,
    searchTerm: query,
  });

  return (
    <>
      {galleries.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="text-center">Imágenes</TableHead>
                  <TableHead className="w-[200px]">Fecha</TableHead>
                  <TableHead className="text-center">Activo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {galleries.map((gallery) => (
                  <TableRow key={gallery.id}>
                    <TableCell>{gallery.title}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline-info">
                        {gallery.imagesCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(gallery.galleryDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                    <TableCell className="text-center">
                      {/* <ActiveSwitch
                        resource={{ id: gallery.id, state: gallery.active }}
                        updateResourceStateAction={updateTournamentStateAction}
                      /> */}
                      {gallery.active ? 'Si' : 'No'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/torneos/${gallery.permalink}`}>
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
                            <Link href={`/admin/galerias/editar/${gallery.permalink}`}>
                              <Button variant="outline-warning" size="icon">
                                <Pencil />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>editar</p>
                          </TooltipContent>
                        </Tooltip>
                        {/* <DeleteGallery
                          tournamentId={gallery.id}
                          roles={session?.user.roles as string[]}
                        /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
            No hay galerías
          </p>
        </div>
      )}
    </>
  );
};

export default GalleriesTable;
