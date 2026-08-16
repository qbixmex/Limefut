import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GalleryForm } from '../../(components)/galleryForm';
import { redirect } from 'next/navigation';
import { fetchGalleryAction } from '../../(actions)';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditGalleryPage: FC<Props> = async ({ params }) => {
  const galleryId = (await params).id;

  const response = await fetchGalleryAction(galleryId);

  if (!response.ok && !response.gallery) {
    redirect(ROUTES.ADMIN_GALLERIES);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Galería</CardTitle>
          </CardHeader>
          <CardContent>
            <GalleryForm
              gallery={response.gallery!}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditGalleryPage;
