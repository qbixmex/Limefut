import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateGalleryForm } from './create-gallery-form';

const CreateGalleryPage = () => {
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
              Crear Galería
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateGalleryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGalleryPage;
