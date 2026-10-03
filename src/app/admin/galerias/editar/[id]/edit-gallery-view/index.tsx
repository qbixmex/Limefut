import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchGalleryAction } from '../../../(actions)';
import { EditGalleryForm } from '../edit-gallery-form';
import { ROUTES } from '@/shared/constants/routes';
import type { Gallery } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditGalleryPageView: FC<Props> = async ({ params }) => {
  const galleryId = (await params).id;

  const response = await fetchGalleryAction(galleryId);

  if (!response.ok || !response.gallery) {
    redirect(
      `${ROUTES.ADMIN_GALLERIES}?error=${encodeURIComponent(response.message)}`,
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle
              className="admin-page-card-title"
              role="heading"
              aria-label="Título de la página"
            >
              Editar Galería
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditGalleryForm gallery={response.gallery as Gallery} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
