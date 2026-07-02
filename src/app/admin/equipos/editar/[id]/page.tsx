import { Suspense, type FC } from 'react';
import { EditTeamView } from './edit-team-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditTeamPage: FC<Props> = async ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EditTeamView paramsPromise={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTeamPage;
