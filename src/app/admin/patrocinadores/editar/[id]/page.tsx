import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchSponsorAction } from '../../(actions)';
import { SponsorForm } from '../../(components)/sponsor-form';
import { ROUTES } from '@/shared/constants/routes';

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

  const { ok, sponsor } = await fetchSponsorAction(sponsorId);

  if (!ok) {
    const message = `¡ El patrocinador con el id: "${sponsorId}", no existe ❌ !`;
    redirect(`${ROUTES.ADMIN_SPONSORS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Patrocinador</CardTitle>
          </CardHeader>
          <CardContent>
            <SponsorForm
              sponsor={sponsor!}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditSponsorPage;
