import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { EditTournamentForm } from './edit-tournament-form';
import { CategorySelectField } from '../../(components)/form-fields/categories-select-field';
import type { TOURNAMENT_TYPE } from '../../(actions)/fetch-tournament-for-edit.action';
import { fetchTournamentForEditAction } from '../../(actions)/fetch-tournament-for-edit.action';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';

type Props = Readonly<{
  paramsPromise: Promise<{
    id: string;
  }>;
}>;

export const EditTournamentView: FC<Props> = async ({ paramsPromise }) => {
  const tournamentId = (await paramsPromise).id;

  const { ok, message, tournament } = await fetchTournamentForEditAction({
    tournamentId,
  });

  if (!ok) {
    redirect(`${ROUTES.ADMIN_TOURNAMENTS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <EditTournamentForm
      key={randomUUID()}
      tournament={tournament as TOURNAMENT_TYPE}
      categorySlot={<CategorySelectField />}
    />
  );
};
