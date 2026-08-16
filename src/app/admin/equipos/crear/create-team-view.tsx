import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { CategorySelectField } from '../(components)/form-fields/category-select-field';
import { TournamentSelectField } from '../(components)/form-fields/tournament-select-field';
import { CoachSelectField } from '../(components)/form-fields/coach-select-field';
import { FieldSelectField } from '../(components)/form-fields/field-select-field';
import { CreateTeamForm } from './create-team-form';

export const CreateTeamView: FC = async () => {
  return (
    <CreateTeamForm
      key={randomUUID()}
      tournamentSlot={<TournamentSelectField />}
      categorySlot={<CategorySelectField />}
      coachesSlot={<CoachSelectField />}
      fieldsSlot={<FieldSelectField />}
    />
  );
};
