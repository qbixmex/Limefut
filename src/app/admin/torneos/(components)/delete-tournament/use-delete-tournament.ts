'use client';

import { toast } from 'sonner';
import { deleteTournamentAction } from '../../(actions)';

export const useDeleteTournament = (
  tournamentId: string,
) => {
  const onDeleteTournament = async () => {
    const { ok, message } = await deleteTournamentAction(tournamentId);
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
