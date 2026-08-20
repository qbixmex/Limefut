import { Suspense, type FC } from 'react';
import { CoachView } from './coach-view';
import { CoachViewSkeleton } from './coach-view-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const CoachPage: FC<Props> = async ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles del Entrenador</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<CoachViewSkeleton />}>
              <CoachView params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachPage;
