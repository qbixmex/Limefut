import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SponsorForm } from '../(components)/sponsor-form';

const CreateSponsorPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Patrocinador</CardTitle>
          </CardHeader>
          <CardContent>
            <SponsorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSponsorPage;
