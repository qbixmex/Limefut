import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchHeroBannerAction } from '../../(actions)';
import { BannerForm } from '../../(components)/banner-form';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditHeroBannerPage: FC<Props> = ({ params }) => {
  return (
    <EditHeroBannerContent params={params} />
  );
};

const EditHeroBannerContent: FC<Props> = async ({ params }) => {
  const heroBannerId = (await params).id;

  const response = await fetchHeroBannerAction(heroBannerId);

  if (!response.heroBanner) {
    const message = `¡ El banner con el id: "${heroBannerId}", no existe ❌ !`;
    redirect(`/admin/banners?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <BannerForm
              key={randomUUID()}
              heroBanner={response.heroBanner}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditHeroBannerPage;
