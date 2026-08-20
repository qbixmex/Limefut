import { Suspense, type FC } from 'react';
import { FieldView } from './field-view';
import { FieldViewSkeleton } from './field-view-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const FieldPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles de la Cancha</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<FieldViewSkeleton />}>
              <FieldView params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FieldPage;
