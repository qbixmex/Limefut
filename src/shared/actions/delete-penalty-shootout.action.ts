'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePenaltyShootoutAction = async ({
  id,
  winnerTeamId,
  phase,
} : {
  id: string;
  winnerTeamId: string | null;
  phase: 'regular' | 'playoffs';
}): Promise<ResponseDeleteAction> => {
  const shootout = await prisma.penaltyShootout.findUnique({
    where: { id },
  });

  if (!shootout) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el la tanda de penales, quizás fue eliminada ó no existe !',
    };
  }

  await prisma.penaltyShootout.delete({ where: { id: shootout.id } });

  // Remove Additional Points is there is a winner on Penalty Shootouts
  if (phase === 'regular' && winnerTeamId) {
    await prisma.$transaction(async (transaction) => {
      const standings = await transaction.standings.findUnique({
        where: { teamId: winnerTeamId },
        select: {
          additionalPoints: true,
          totalPoints: true,
        },
      });

      if (
        standings &&
        (standings.additionalPoints > 0) &&
        (standings.totalPoints > 0)
      ) {
        await transaction.standings.update({
          where: { teamId: winnerTeamId },
          data: {
            additionalPoints: {
              decrement: 1,
            },
            totalPoints: {
              decrement: 1,
            },
          },
        });
      }
    });
  }

  // Update Cache
  if (phase === 'regular') {
    updateTag('admin-matches');
    updateTag('admin-match');
    updateTag('public-matches');
    updateTag('public-results-roles');
    updateTag('public-result-details');
    updateTag('public-matches-count');
    updateTag('public-team-standings');
  }

  if (phase === 'playoffs') {
    updateTag('admin-playoff-matches');
    updateTag('admin-playoff-match');
    updateTag('public-playoff-matches');
    updateTag('public-playoff-match');
  }

  return {
    ok: true,
    message: '¡ La tanda de penales ha sido eliminada correctamente 👍 !',
  };
};
