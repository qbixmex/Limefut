'use client';

import { toast } from 'sonner';
import { deleteTournamentAction } from '../../(actions)';

export const useDeleteTournament = (
  tournamentId: string,
  userId: string | undefined,
  roles: string[],
) => {
  const onDeleteTournament = async () => {
    if (roles && !roles.includes('admin')) {
      toast.error('¡ No tienes permisos administrativos para eliminar torneos !');
      return;
    }
    const { ok, message } = await deleteTournamentAction({
      tournamentId,
      authenticatedUserId: userId,
      authenticatedUserRoles: roles,
    });
    if (!ok) {
      toast.error(message);
      return;
    }
    toast.success(message);
  };

  return {
    onDeleteTournament,
  };
};
