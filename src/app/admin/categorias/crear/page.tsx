import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateCategoryForm } from '../(components)/create-category-form';

const CreateCategoryPage = async () => {
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
              Crear Categoría
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <CreateCategoryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCategoryPage;
