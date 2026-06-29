import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ROUTES } from '@/shared/constants/routes';
import { EditTournamentForm } from './edit-tournament-form';
import { CategorySelectField } from '../../(components)/form-fields/categories-select-field';
import type { TOURNAMENT_TYPE } from '../../(actions)/fetch-tournament-for-edit.action';
import { fetchTournamentForEditAction } from '../../(actions)/fetch-tournament-for-edit.action';

type Props = Readonly<{
  paramsPromise: Promise<{
    id: string;
  }>;
}>;

export const EditTournamentView: FC<Props> = async ({ paramsPromise }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const tournamentId = (await paramsPromise).id;

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para editar torneos !';
    redirect(`${ROUTES.ADMIN_TOURNAMENTS}?error=${encodeURIComponent(message)}`);
  }

  const { ok, message, tournament } = await fetchTournamentForEditAction({
    authenticatedUserId: session?.user.id,
    authenticatedUserRoles: session?.user.roles,
    tournamentId,
  });

  if (!ok) {
    redirect(`${ROUTES.ADMIN_TOURNAMENTS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <EditTournamentForm
      key={randomUUID()}
      tournament={tournament as TOURNAMENT_TYPE}
      authenticatedUserId={session?.user.id}
      authenticatedUserRoles={session?.user.roles}
      categorySlot={<CategorySelectField />}
    />
  );
};
