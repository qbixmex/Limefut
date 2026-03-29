import type { FC } from 'react';
import { headers } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GalleryForm } from '../../(components)/galleryForm';
import type { Session } from '@/lib/auth-client';
import { auth } from '@/lib/auth';
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
  const session = await auth.api.getSession({ headers: await headers() });

  const response = await fetchGalleryAction(session?.user.roles ?? [], galleryId);

  if (!response.ok && !response.gallery) {
    redirect(ROUTES.ADMIN_GALLERIES);
  }

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para actualizar galerías !';
    redirect(`/admin/galerias?error=${encodeURIComponent(message)}`);
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
              session={session as Session}
              gallery={response.gallery!}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditGalleryPage;
