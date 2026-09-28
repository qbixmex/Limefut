import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateCoachForm } from './create-coach-form';

export const CreateCoachPageView = async () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Entrenador</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateCoachForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
