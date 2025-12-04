import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '~/src/auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImageIcon, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Gallery } from '~/src/shared/interfaces';
import { GalleryImage } from '~/src/generated/prisma';

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

export const GalleryDetailsPage: FC<Props> = async ({ params }) => {
  const session = await auth();
  const permalink = (await params).permalink;

  // const response = await fetchGalleryAction(permalink, session?.user.roles ?? null);

  // if (!response.ok) {
  //   redirect(`/admin/galerias?error=${encodeURIComponent(response.message)}`);
  // }

  // const gallery = response.gallery!;
  const gallery: Gallery & { images: GalleryImage[] } = {
    id: 'abc',
    title: 'Finales 2022',
    permalink: 'finales-2022',
    galleryDate: new Date('2022-02-01T16:32:15.722Z'),
    active: true,
    createdAt: new Date('2022-02-01T16:22:02.232Z'),
    updatedAt: new Date('2022-02-01T18:52:07.763Z'),
    images: [
      {
        id: 'sd89f7sdfis7dfo8sdf7so',
        title: 'Foto grupal',
        permalink: 'foto_grupal',
        imageUrl: 'https://cloudinary.com/abcdersgs',
        imagePublicID: 'cx8f7sdfksudfi8s7dfsjdfhsk',
        active: true,
        galleryId: 'sd89f7sdfis7dfo8sdf7so',
        createdAt: new Date('2022-02-01T18:22:12.232Z'),
        updatedAt: new Date('2022-02-01T18:22:12.324Z')
      },
      {
        id: 'sd987fsodifsdof9s8dfs9oi',
        title: 'Foto con el entrenador',
        permalink: 'foto_con_el_entrenador',
        imageUrl: 'https://cloudinary.com/asdaysiduya',
        imagePublicID: 'as8da9s8d7as89da',
        active: true,
        galleryId: 'sd89f7sdfis7dfo8sdf7so',
        createdAt: new Date('2022-02-01T18:22:12.232Z'),
        updatedAt: new Date('2022-02-01T18:22:12.324Z'),
      },
    ],
  };

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
                !gallery.images ? (
                  <div className="border-2 border-cyan-600 rounded-lg px-2 py-4">
                    <p className="text-cyan-600 text-center font-bold">Aún no hay jugadores registrados</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {gallery.images.map(({ id, title }) => (
                      <div key={id}>
                        <figure className="space-y-2">
                          <ImageIcon className="size-[250px] text-gray-500" strokeWidth={1} />
                          <figcaption className="text-sm italic text-center text-gray-500">
                            { title }
                          </figcaption>
                        </figure>
                      </div>
                    ))}
                  </div>
                )
              }
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/galerias/editar/${gallery.permalink}`}>
                    <Button variant="outline-warning" size="icon">
                      <Pencil />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>editar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GalleryDetailsPage;
