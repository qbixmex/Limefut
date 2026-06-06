import type { FC } from 'react';
import { TournamentFormSelect } from './tournament-form-select';
import { fetchTournamentsAction } from '../../../(actions)/fetch-tournaments.action';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}>;

export const TournamentSelectField: FC<Props> = async ({
  authenticatedUserId,
  authenticatedUserRoles,
}) => {
  const { ok, message, tournaments } = await fetchTournamentsAction({
    authenticatedUserId,
    authenticatedUserRoles,
  });

  if (!ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <TournamentFormSelect tournaments={tournaments} />
  );
};
