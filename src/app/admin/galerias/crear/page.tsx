import type { FC } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GalleryForm } from '../(components)/galleryForm';

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
  }>;
}>;

const CreateGalleryPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <CreateGalleryContent searchParams={searchParams} />
    </Suspense>
  );
};

const CreateGalleryContent: FC<Props> = async ({ searchParams }) => {
  const { torneo: tournamentId } = await searchParams;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Galería</CardTitle>
          </CardHeader>
          <CardContent>
            <GalleryForm
              tournamentId={tournamentId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGalleryPage;
