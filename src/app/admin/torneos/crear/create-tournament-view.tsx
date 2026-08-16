import { randomUUID } from 'node:crypto';
import { CreateTournamentForm } from './create-tournament-form';
import { CategorySelectField } from '../(components)/form-fields/categories-select-field';

export const CreateTournamentView = async () => {
  return (
    <CreateTournamentForm
      key={randomUUID()}
      categorySlot={<CategorySelectField />}
    />
  );
};
