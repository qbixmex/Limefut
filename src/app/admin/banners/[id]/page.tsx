import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings2 } from 'lucide-react';
import { BannerView } from './banner-view';
import { BannerViewSkeleton } from './banner-view-skeleton';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const BannerPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle
              className="admin-page-card-title inline-flex items-center gap-2"
              role="heading"
              aria-label="Título de la página"
            >
              Ajustes del Banner
              <Settings2 aria-hidden="true" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<BannerViewSkeleton />}>
              <BannerView params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BannerPage;
