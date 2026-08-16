import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CoachForm } from '../(components)/coachForm';

const CreateCoachPage = () => {
  return (
    <Suspense>
      <CreateCoachPageContent />
    </Suspense>
  );
};

const CreateCoachPageContent = async () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Entrenador</CardTitle>
          </CardHeader>
          <CardContent>
            <CoachForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCoachPage;
