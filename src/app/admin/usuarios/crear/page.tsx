import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UsersForm } from '../(components)/usersForm';
import { Suspense } from 'react';

const CreateUserPage = () => {
  return (
    <Suspense>
      <CreateUserContent />
    </Suspense>
  );
};

const CreateUserContent = async () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateUserPage;
