import type { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { es } from 'date-fns/locale';

type Props = Readonly<{
  gallery: {
    id: string;
    title: string;
    permalink: string;
    galleryDate: Date;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}>;

export const GalleryData: FC<Props> = ({ gallery }) => {
  return (
    <section className="flex flex-col lg:flex-row mb-10">
      <div className="w-full lg:w-1/2">
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="font-semibold w-[180px]">Título</TableHead>
              <TableCell>{gallery.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-semibold w-[180px]">Fecha</TableHead>
              <TableCell>
                {format(new Date(gallery.galleryDate), "d 'de' MMMM 'del' yyyy", { locale: es })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px] font-semibold">Enlace Permanente</TableHead>
              <TableCell>{gallery.permalink}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="w-full lg:w-1/2">
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-[180px] font-semibold">Fecha de Creación</TableHead>
              <TableCell>
                {format(new Date(gallery?.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px] font-semibold">Última actualización</TableHead>
              <TableCell>
                {format(new Date(gallery?.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium w-[180px]">Estado</TableHead>
              <TableCell>
                {
                  gallery.active
                    ? <Badge variant="outline-info">Activa</Badge>
                    : <Badge variant="outline-warning">No Activa</Badge>
                }
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
