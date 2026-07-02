import type { FC } from 'react';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import { CoachesFormSelect } from './coaches-form-select';
import { fetchCoachesForTeam } from '../../../(actions)/fetchCoachesForTeam';

export const CoachSelectField: FC = async () => {
  const { ok, message, coaches } = await fetchCoachesForTeam();

  if (!ok) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(message)}`);
  }

  if (ok && coaches?.length === 0) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${
      encodeURIComponent('¡ No puedes crear un equipo sin entrenadores activos !')
    }`);
  }

  return (
    <CoachesFormSelect coaches={coaches} />
  );
};
