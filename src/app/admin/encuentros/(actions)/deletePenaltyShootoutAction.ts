'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePenaltyShootoutAction = async (
  id: string,
  winnerTeamId: string | null,
): Promise<ResponseDeleteAction> => {
  const shootout = await prisma.penaltyShootout.findUnique({
    where: { id },
  });

  if (!shootout) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el la tanda de penales, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.penaltyShootout.delete({ where: { id: shootout.id } });

  // Remove Additional Points is there is a winner on Penalty Shootouts
  if (winnerTeamId) {
    await prisma.$transaction(async (transaction) => {
      const standings = await transaction.standings.findUnique({
        where: { teamId: winnerTeamId },
        select: {
          additionalPoints: true,
          totalPoints: true,
        },
      });

      if (
        standings
        && (standings.additionalPoints > 0)
        && (standings.totalPoints > 0)
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
  updateTag('admin-matches');
  updateTag('admin-match');
  updateTag('public-matches');
  updateTag("public-results-roles");
  updateTag("public-result-details");

  return {
    ok: true,
    message: `¡ La tanda de penales ha sido eliminada correctamente 👍 !`,
  };
};
