import { Suspense, type FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EditUserView } from './edit-user-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditUser: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EditUserView params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditUser;
