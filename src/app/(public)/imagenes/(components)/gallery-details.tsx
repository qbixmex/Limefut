import { type FC } from 'react';
import { fetchGalleryAction, type GalleryType } from "../(actions)/fetchGalleryAction";
import { redirect } from 'next/navigation';
import { ImageGallery } from './image-gallery';
import { Heading } from '../../components/heading';
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
      >
        {gallery?.title}
      </Heading>

      <div className="w-full max-w-100 flex flex-col gap-5 bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg mb-10">
        {gallery?.team?.name && (
          <Link href={
            `/equipos/${gallery.team.permalink}`
            + `?torneo=${gallery.tournament?.permalink}`
            + `&categoria=${gallery.team.category}`
            + `&formato=${gallery.team.format}`
          }>
            <p className="text-gray-700 dark:text-gray-200">
              <b>Equipo</b>&nbsp;
              <span className="italic">{gallery?.team?.name}</span>
            </p>
          </Link>
        )}
        <p className="text-gray-700 dark:text-gray-200">
          <b>Fecha</b>&nbsp;
          <span className="italic">
            {format( gallery?.galleryDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
          </span>
        </p>
      </div>

      <ImageGallery
        galleryImages={(gallery as GalleryType).images}
      />
    </>
  );
};

export default GalleryDetails;
