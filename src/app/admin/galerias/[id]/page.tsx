import { Suspense, type FC } from 'react';
import type { Session } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
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
import { buttonVariants } from '@/components/ui/button';
import { GalleryImageForm } from '../(components)/galleryImageForm';
import { fetchGalleryAction } from '../(actions)';
import { GalleryImages } from '../(components)/gallery-images';
import { headers } from 'next/headers';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const GalleryDetailsPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <GalleryDetailsContent params={params} />
    </Suspense>
  );
};

const GalleryDetailsContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const galleryId = (await params).id;

  const response = await fetchGalleryAction(session?.user.roles ?? [], galleryId);

  if (!response.ok) {
    redirect(`/admin/galerias?error=${encodeURIComponent(response.message)}`);
  }

  const gallery = response.gallery!;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles de la Galería</CardTitle>
            <div className="space-x-5">
              <GalleryImageForm
                session={session as Session}
                galleryId={gallery.id as string}
                imagesQuantity={gallery.images.length}
              />
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={`/admin/galerias/editar/${gallery.id}`}
                    className={buttonVariants({
                      variant: 'outline-warning',
                      size: 'icon',
                    })}
                  >
                    <Pencil />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">editar</TooltipContent>
              </Tooltip>
            </div>
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
                    <p className="text-cyan-600 text-center font-bold">
                      La galería aún no tiene imágenes
                    </p>
                  </div>
                ) : (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <GalleryImages images={gallery.images} />
                  </div>
                )
              }
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GalleryDetailsPage;
