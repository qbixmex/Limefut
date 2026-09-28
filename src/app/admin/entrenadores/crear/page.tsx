import { CreateCoachView } from './create-coach-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CreateCoachPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Entrenador</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateCoachView />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCoachPage;
