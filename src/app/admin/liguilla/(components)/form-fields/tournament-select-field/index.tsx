import type { FC } from 'react';
import { TournamentFormSelect } from './tournament-form-select';
import { fetchTournamentsAction } from '../../../(actions)/fetch-tournaments.action';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';

export const TournamentSelectField: FC = async () => {
  const { ok, message, tournaments } = await fetchTournamentsAction();

  if (!ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <TournamentFormSelect tournaments={tournaments} />
  );
};
