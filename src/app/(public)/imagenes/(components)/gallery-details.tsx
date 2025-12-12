import { type FC } from 'react';
import { fetchGalleryAction, type GalleryType } from "../(actions)/fetchGalleryAction";
import { redirect } from 'next/navigation';
import { ImageGallery } from './image-gallery';
import { Heading } from '../../components/heading';
import { Table, TableBody, TableCell, TableHead, TableRow } from '~/src/components/ui/table';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Props = Readonly<{
  paramsPromise: Promise<{
    permalink: string;
  }>;
}>;

export const GalleryDetails: FC<Props> = async ({ paramsPromise }) => {
  const permalink = (await paramsPromise).permalink;
  const { ok, gallery, message } = await fetchGalleryAction(permalink);

  if (!ok && gallery) {
    redirect(`/imagenes?error=${encodeURIComponent(message)}`);
  }

  return (
    <>
      <Heading
        level="h1"
        className="text-emerald-600 mb-10"
      >{gallery?.title}</Heading>

      <Table className="mb-10 w-full md:w-1/2">
        <TableBody>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableCell>
              {format(gallery?.galleryDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Torneo</TableHead>
            <TableCell>
              <Link href={`/equipos/${gallery?.team.permalink}`}>
                {gallery?.team.name}
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <ImageGallery
        galleryImages={(gallery as GalleryType).images}
      />
    </>
  );
};

export default GalleryDetails;
