import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateBannerForm } from './create-banner-form';

const CreateBannerPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle
              className="admin-page-card-title"
              role="heading"
              aria-label="Título de la página"
            >
              Crear Banner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateBannerForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBannerPage;
