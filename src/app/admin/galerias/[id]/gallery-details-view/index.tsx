import type { FC } from 'react';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AddImage } from '../../(components)/gallery-images/gallery-image-form';
import { fetchGalleryAction } from '../../(actions)';
import { GalleryImages } from '../../(components)/gallery-images';
import { ROUTES } from '@/shared/constants/routes';
import type { GALLERY_TYPE } from '../../(actions)/gallery/fetch-gallery.action';
import { EmptyMessageResource } from '@/shared/components/empty-message-resource';
import { EditGallery } from '../../(components)/edit-gallery';
import { GalleryData } from '../../(components)/gallery-data';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const GalleryDetailsView: FC<Props> = async ({ params }) => {
  const galleryId = (await params).id;

  const response = await fetchGalleryAction(galleryId);

  if (!response.ok) {
    redirect(`${ROUTES.ADMIN_GALLERIES}?error=${encodeURIComponent(response.message)}`);
  }

  const gallery = response.gallery as GALLERY_TYPE;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles de la Galería</CardTitle>
            <div className="space-x-2">
              <AddImage
                galleryId={gallery.id as string}
                imagesQuantity={gallery.images.length}
              />
              <EditGallery galleryId={gallery.id} />
            </div>
          </CardHeader>
          <CardContent>
            <GalleryData
              gallery={{
                id: gallery.id,
                title: gallery.title,
                permalink: gallery.permalink,
                galleryDate: gallery.galleryDate,
                active: gallery.active,
                createdAt: gallery.createdAt,
                updatedAt: gallery.updatedAt,
              }}
            />

            <GalleryImages images={gallery.images} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
