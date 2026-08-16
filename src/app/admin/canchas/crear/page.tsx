import { Suspense, type FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldForm } from '../(components)/fieldForm';

const CreateFieldPage = () => {
  return (
    <Suspense>
      <CreateFieldContent />
    </Suspense>
  );
};

const CreateFieldContent: FC = async () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Cancha</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateFieldPage;
