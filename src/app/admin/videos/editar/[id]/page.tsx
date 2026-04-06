import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { headers } from 'next/headers';
import type { Session } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
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
  const session = await auth.api.getSession({ headers: await headers() });

  const { ok, video } = await fetchVideoAction(session?.user.roles ?? [], sponsorId);

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
              key={randomUUID()}
              session={session as Session}
              video={video!}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditVideoPage;
