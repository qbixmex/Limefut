import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { headers } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { fetchAnnouncementAction } from '../../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { EditAnnouncementForm } from './edit-announcement.form';
import type { Announcement } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditAnnouncementPage: FC<Props> = ({ params }) => {
  return (
    <EditAnnouncementContent params={params} />
  );
};

const EditAnnouncementContent: FC<Props> = async ({ params }) => {
  const announcementId = (await params).id;
  const session = await auth.api.getSession({ headers: await headers() });

  const { ok, announcement } = await fetchAnnouncementAction(session?.user.roles ?? [], announcementId);

  if (!ok) {
    const message = `¡ La noticia con el id: "${announcementId}", no existe ❌ !`;
    redirect(`${ROUTES.ADMIN_ANNOUNCEMENTS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Noticia</CardTitle>
          </CardHeader>
          <CardContent>
            <EditAnnouncementForm
              key={randomUUID()}
              announcement={announcement as Announcement}
              authenticatedUserId={session?.user.id}
              authenticatedUserRoles={session?.user.roles}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAnnouncementPage;
