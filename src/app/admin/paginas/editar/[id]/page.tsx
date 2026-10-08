import { Suspense, type FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EditCustomPageView } from './edit-custom-page-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCustomPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Página</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EditCustomPageView params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCustomPage;
