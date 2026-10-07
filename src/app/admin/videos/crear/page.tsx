import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateVideoForm } from './create-video-form';

const CreateVideoPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">
              Crear Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateVideoForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateVideoPage;
