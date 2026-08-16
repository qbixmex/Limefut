import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateTournamentForm } from './create-tournament-form';
import { CategorySelectField } from '../(components)/form-fields/categories-select-field';

const CreateTournamentPage = () => {
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
              Crear Torneo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CreateTournamentForm categorySlot={<CategorySelectField />} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTournamentPage;
