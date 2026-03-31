import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { headers } from 'next/headers';
import type { Session } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { fetchSponsorAction } from '../../(actions)';
import { SponsorForm } from '../../(components)/sponsor-form';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditSponsorPage: FC<Props> = ({ params }) => {
  return (
    <EditSponsorContent params={params} />
  );
};

const EditSponsorContent: FC<Props> = async ({ params }) => {
  const sponsorId = (await params).id;
  const session = await auth.api.getSession({ headers: await headers() });

  const { ok, sponsor } = await fetchSponsorAction(session?.user.roles ?? [], sponsorId);

  if (!ok) {
    const message = `¡ El patrocinador con el id: "${sponsorId}", no existe ❌ !`;
    redirect(`/admin/patrocinadores?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <SponsorForm
              key={randomUUID()}
              session={session as Session}
              sponsor={sponsor!}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditSponsorPage;
