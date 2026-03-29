import type { FC } from 'react';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GalleryForm } from '../(components)/galleryForm';
import type { Session } from '@/lib/auth-client';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

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
  const session = await auth.api.getSession({ headers: await headers() });

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear galerías !';
    redirect(`/admin/galerias?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Galería</CardTitle>
          </CardHeader>
          <CardContent>
            <GalleryForm
              session={session as Session}
              tournamentId={tournamentId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGalleryPage;
