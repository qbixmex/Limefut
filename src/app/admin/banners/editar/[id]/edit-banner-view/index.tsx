import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { fetchHeroBannerAction } from '../../../(actions)';
import { EditBannerForm } from '../edit-banner-form';
import { ROUTES } from '@/shared/constants/routes';
import type { HeroBanner } from '@/shared/interfaces';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditBannerPageView: FC<Props> = async ({ params }) => {
  const bannerId = (await params).id;

  const { ok, message, heroBanner } = await fetchHeroBannerAction(bannerId);

  if (!ok || !heroBanner) {
    redirect(`${ROUTES.ADMIN_BANNERS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle
              className="admin-page-card-title"
              role="heading"
              aria-label="Título de la página"
            >
              Editar Banner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditBannerForm
              heroBanner={heroBanner as HeroBanner}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
