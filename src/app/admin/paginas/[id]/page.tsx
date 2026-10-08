import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomPageDetailsView } from './custom-page-details-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const PageDetails: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles de la Página</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomPageDetailsView params={params} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageDetails;
