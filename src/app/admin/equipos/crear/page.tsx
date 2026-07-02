import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateTeamView } from './create-team-view';

const CreateTeamPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CreateTeamView />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTeamPage;
