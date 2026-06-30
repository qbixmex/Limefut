import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Suspense } from 'react';
import { CreateTournamentView } from './create-tournament-view';

const CreateTournamentPage = async () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CreateTournamentView />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTournamentPage;
