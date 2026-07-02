import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { CategorySelectField } from '../../(components)/form-fields/category-select-field';
import { TournamentSelectField } from '../../(components)/form-fields/tournament-select-field';
import { CoachSelectField } from '../../(components)/form-fields/coach-select-field';
import { FieldSelectField } from '../../(components)/form-fields/field-select-field';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { fetchTeamForEditAction } from '../../(actions)/fetch-team-for-edit.action';
import { EditTeamForm } from './edit-team-form';

type Props = Readonly<{
  paramsPromise: Promise<{
    id: string;
  }>;
}>;

export const EditTeamView: FC<Props> = async ({ paramsPromise }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const teamId = (await paramsPromise).id;

  const { ok, message, team } = await fetchTeamForEditAction({
    authenticatedUserId: session?.user.id,
    authenticatedUserRoles: session?.user.roles,
    teamId,
  });

  if (!ok || !team) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <EditTeamForm
      key={randomUUID()}
      authenticatedUserId={session?.user.id}
      authenticatedUserRoles={session?.user.roles}
      team={team}
      tournamentSlot={<TournamentSelectField />}
      categorySlot={<CategorySelectField />}
      coachesSlot={<CoachSelectField />}
      fieldsSlot={<FieldSelectField />}
    />
  );
};
