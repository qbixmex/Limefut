import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateFieldForm } from './create-field-form';

const CreateFieldPage = () => {
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
              Crear Cancha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateFieldForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateFieldPage;
