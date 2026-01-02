import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '~/src/auth';
import type { Session } from 'next-auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GalleryImageForm } from '../(components)/galleryImageForm';
import { fetchGalleryAction } from '../(actions)';
import { GalleryImages } from '../(components)/gallery-images';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const GalleryDetailsPage: FC<Props> = async ({ params }) => {
  const session = await auth();
  const galleryId = (await params).id;

  const response = await fetchGalleryAction(session?.user.roles ?? [], galleryId);

  if (!response.ok) {
    redirect(`/admin/galerias?error=${encodeURIComponent(response.message)}`);
  }

  const gallery = response.gallery!;

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800 relative">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              <h1 className="text-xl font-bold text-green-500">
                Detalles de la Galería
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                        {format(new Date(gallery?.galleryDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
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

            <section>
              <h2 className="text-xl font-bold text-sky-600 mb-5">Imágenes</h2>
              {
                gallery.images.length === 0 ? (
                  <div className="border-2 border-cyan-600 rounded-lg px-2 py-4">
                    <p className="text-cyan-600 text-center font-bold">La galería aún no tiene imágenes</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <GalleryImages images={gallery.images} />
                  </div>
                )
              }
            </section>

            <div className="absolute top-5 right-5 space-x-5">
              <GalleryImageForm
                session={session as Session}
                galleryId={gallery.id as string}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/galerias/editar/${gallery.id}`}>
                    <Button variant="outline-warning" size="icon">
                      <Pencil />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">editar</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GalleryDetailsPage;
