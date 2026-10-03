import type { FC } from 'react';
import { getSession } from '@/lib/get-session';
import { fetchGalleriesAction, updateGalleryStateAction } from '../(actions)';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns/format';
import { ActiveSwitch } from '~/src/shared/components/active-switch';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Pagination } from '@/shared/components/pagination';
import { Badge } from '@/components/ui/badge';
import { DeleteGallery } from './delete-gallery';
import { EditGallery } from './edit-gallery';
import { ShowGalleryImages } from './show-gallery-images';
import { EmptyMessageResource } from '@/shared/components/empty-message-resource';

type Props = Readonly<{
  query: string | undefined;
  currentPage: string | undefined;
}>;

export const GalleriesTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {
  const session = await getSession();

  const {
    galleries = [],
    pagination,
  } = await fetchGalleriesAction({
    page: currentPage as number,
    take: 12,
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
                      <ActiveSwitch
                        resource={{ id: gallery.id, state: gallery.active }}
                        updateResourceStateAction={updateGalleryStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <ShowGalleryImages galleryId={gallery.id} />
                        <EditGallery galleryId={gallery.id} />
                        <DeleteGallery
                          galleryId={gallery.id}
                          roles={session?.user.roles as string[]}
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
        <EmptyMessageResource>
          No hay galerías
        </EmptyMessageResource>
      )}
    </>
  );
};
