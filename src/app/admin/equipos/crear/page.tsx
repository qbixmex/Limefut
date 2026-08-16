import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateTeamForm } from './create-team-form';
import { CategorySelectField } from '../(components)/form-fields/category-select-field';
import { TournamentSelectField } from '../(components)/form-fields/tournament-select-field';
import { CoachSelectField } from '../(components)/form-fields/coach-select-field';
import { FieldSelectField } from '../(components)/form-fields/field-select-field';

const CreateTeamPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CreateTeamForm
                tournamentSlot={<TournamentSelectField />}
                categorySlot={<CategorySelectField />}
                coachesSlot={<CoachSelectField />}
                fieldsSlot={<FieldSelectField />}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTeamPage;
