import type { FC } from 'react';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import { TournamentsFormSelect } from './tournaments-form-select';
import { fetchTournamentsForTeam } from '../../../(actions)';

export const TournamentSelectField: FC = async () => {
  const { ok, message, tournaments } = await fetchTournamentsForTeam();

  if (!ok) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(message)}`);
  }

  if (ok && tournaments?.length === 0) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${
      encodeURIComponent('¡ No puedes crear un equipo sin torneos activos !')
    }`);
  }

  if (!ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <TournamentsFormSelect tournaments={tournaments} />
  );
};
