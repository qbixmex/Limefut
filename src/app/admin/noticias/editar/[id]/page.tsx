import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchAnnouncementAction } from '../../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { EditAnnouncementForm } from './edit-announcement.form';
import type { ANNOUNCEMENT_TYPE } from '../../(actions)/fetchAnnouncementAction';

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

  const { ok, announcement } = await fetchAnnouncementAction(announcementId);

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
              announcement={announcement as ANNOUNCEMENT_TYPE}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAnnouncementPage;
