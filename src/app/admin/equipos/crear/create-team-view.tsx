import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { CategorySelectField } from '../(components)/form-fields/category-select-field';
import { TournamentSelectField } from '../(components)/form-fields/tournament-select-field';
import { CoachSelectField } from '../(components)/form-fields/coach-select-field';
import { FieldSelectField } from '../(components)/form-fields/field-select-field';
import { CreateTeamForm } from './create-team-form';

export const CreateTeamView: FC = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <CreateTeamForm
      key={randomUUID()}
      authenticatedUserId={session?.user.id}
      authenticatedUserRoles={session?.user.roles}
      tournamentSlot={<TournamentSelectField />}
      categorySlot={<CategorySelectField />}
      coachesSlot={<CoachSelectField />}
      fieldsSlot={<FieldSelectField />}
    />
  );
};
