import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchVideoAction } from '../../(actions)';
import { VideoForm } from '../../(components)/video-form';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditVideoPage: FC<Props> = ({ params }) => {
  return (
    <EditAnnouncementContent params={params} />
  );
};

const EditAnnouncementContent: FC<Props> = async ({ params }) => {
  const sponsorId = (await params).id;

  const { ok, video } = await fetchVideoAction(sponsorId);

  if (!ok) {
    const message = `¡ El video con el id: "${sponsorId}", no existe ❌ !`;
    redirect(`${ROUTES.ADMIN_VIDEOS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Video</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoForm
              video={video!}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditVideoPage;
