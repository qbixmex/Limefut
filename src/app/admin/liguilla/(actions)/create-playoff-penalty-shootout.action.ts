'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import type { PenaltyShootout } from '@/shared/interfaces';
import { createPenaltyShootoutSchema } from '~/src/shared/schemas';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  penaltyShootout: PenaltyShootout | null;
}>;

export const createPlayoffPenaltyShootoutAction = async (
  formData: FormData,
  userRoles: string[] | null | undefined,
): CreateResponseAction => {
  if ((userRoles) && (!userRoles.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      penaltyShootout: null,
    };
  }

  const rawData = {
    matchId: formData.get('matchId') as string,
    localTeamId: formData.get('localTeamId') as string,
    visitorTeamId: formData.get('visitorTeamId') as string,
    localPlayerId: formData.get('localPlayerId') as string,
    localPlayerName: formData.get('localPlayerName') as string,
    visitorPlayerId: formData.get('visitorPlayerId') as string,
    visitorPlayerName: formData.get('visitorPlayerName') as string,
    localIsGoal: formData.get('localIsGoal') as string,
    visitorIsGoal: formData.get('visitorIsGoal') as string,
  };

  const shootoutVerified = createPenaltyShootoutSchema.safeParse(rawData);

  if (!shootoutVerified.success) {
    return {
      ok: false,
      message: shootoutVerified.error.issues[0].message,
      penaltyShootout: null,
    };
  }

  const { matchId, ...shootoutToSave } = shootoutVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      // Verify that the match exists
      const playoffMatch = await transaction.playoffMatch.findFirst({
        where: { id: matchId },
      });

      if (!playoffMatch) {
        return {
          ok: false,
          message: '¡ El encuentro de liguilla con el id subministrado no existe !',
          penaltyShootout: null,
        };
      }

      // Get the existing penalty shootout
      let penaltyShootout = await transaction.penaltyShootout.findFirst({
        where: { playoffMatchId: matchId },
        include: {
          kicks: {
            orderBy: { order: 'desc' },
          },
        },
      });

      // Get the latest penalty kick order
      let nextOrder = 1;
      if (penaltyShootout && penaltyShootout.kicks.length > 0) {
        nextOrder = penaltyShootout.kicks[0].order + 1;
      }

      // If there is no penalty shootout, create one.
      if (!penaltyShootout) {
        penaltyShootout = await transaction.penaltyShootout.create({
          data: {
            playoffMatchId: matchId,
            localTeamId: shootoutToSave.localTeamId,
            visitorTeamId: shootoutToSave.visitorTeamId,
          },
          include: { kicks: true },
        });
        nextOrder = 1;
      }

      // Count existing kicks per team BEFORE adding the new ones
      const localKicksBefore = penaltyShootout.kicks.filter(
        (k) => k.teamId === shootoutToSave.localTeamId,
      ).length;
      const visitorKicksBefore = penaltyShootout.kicks.filter(
        (k) => k.teamId === shootoutToSave.visitorTeamId,
      ).length;

      // Expected kicks after this round (each team shoots once per round)
      const localKicksAfter = localKicksBefore + 1;
      const visitorKicksAfter = visitorKicksBefore + 1;

      let winnerTeamId: string | null = null;
      let status: 'in_progress' | 'completed' = 'in_progress';

      // Calculate the score after this round
      const finalLocalGoals =
        penaltyShootout.localGoals +
        (shootoutToSave.localIsGoal === 'scored' ? 1 : 0);

      const finalVisitorGoals =
        penaltyShootout.visitorGoals +
        (shootoutToSave.visitorIsGoal === 'scored' ? 1 : 0);

      // Check if both teams have completed their 3 mandatory rounds
      const localCompleted = localKicksAfter >= 3;
      const visitorCompleted3 = visitorKicksAfter >= 3;

      if (localCompleted && visitorCompleted3) {
        // Phase 1: Both teams completed mandatory 3 rounds each (6 total kicks)
        if (finalLocalGoals !== finalVisitorGoals) {
          // There is a winner - penalty shootout ends here
          status = 'completed';
          winnerTeamId =
            finalLocalGoals > finalVisitorGoals
              ? shootoutToSave.localTeamId
              : shootoutToSave.visitorTeamId;
        } else {
          // It's a draw after 3 rounds → sudden death begins
          // Each team shoots one more round until there's a winner
          if (shootoutToSave.localIsGoal === 'scored' && shootoutToSave.visitorIsGoal === 'missed') {
            // Local scores, Visitor misses → Local wins
            status = 'completed';
            winnerTeamId = shootoutToSave.localTeamId;
          } else if (shootoutToSave.localIsGoal === 'missed' && shootoutToSave.visitorIsGoal === 'scored') {
            // Local misses, Visitor scores → Visitor wins
            status = 'completed';
            winnerTeamId = shootoutToSave.visitorTeamId;
          }
          // If both score or both miss → sudden death continues (status remains 'in_progress')
        }
      }

      // Create the new penalty kicks with the consecutive commands
      const updatedShootout = await transaction.penaltyShootout.update({
        where: { id: penaltyShootout.id },
        data: {
          localGoals: shootoutToSave.localIsGoal === 'scored'
            ? penaltyShootout.localGoals + 1
            : undefined,
          visitorGoals: shootoutToSave.visitorIsGoal === 'scored'
            ? penaltyShootout.visitorGoals + 1
            : undefined,
          winnerTeamId,
          status,
          kicks: {
            create: [
              {
                teamId: shootoutToSave.localTeamId,
                playerId: shootoutToSave.localPlayerId,
                shooterName: shootoutToSave.localPlayerName,
                isGoal: (shootoutToSave.localIsGoal === 'scored' && true) ||
                  (shootoutToSave.localIsGoal === 'missed' && false) ||
                  (shootoutToSave.localIsGoal === 'not-taken' && null),
                order: nextOrder,
              },
              {
                teamId: shootoutToSave.visitorTeamId,
                playerId: shootoutToSave.visitorPlayerId,
                shooterName: shootoutToSave.visitorPlayerName,
                isGoal: (shootoutToSave.visitorIsGoal === 'scored' && true) ||
                  (shootoutToSave.visitorIsGoal === 'missed' && false) ||
                  (shootoutToSave.visitorIsGoal === 'not-taken' && null),
                order: nextOrder + 1,
              },
            ],
          },
        },
        include: { kicks: true },
      });

      return {
        ok: true,
        message: '¡ Tanda de penales creada correctamente 👍 !',
        penaltyShootout: updatedShootout,
      };
    });

    // Refresh Cache
    updateTag('admin-playoff-matches');
    updateTag('admin-playoff-match');
    updateTag('public-playoff-matches');
    updateTag('public-playoff-match');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        console.log('ERROR MESSAGE:', error.message);
        return {
          ok: false,
          message: error.message,
          penaltyShootout: null,
        };
      }
      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('META:', error.meta);
      console.log('MESSAGE:', error.message);
      console.log(error.message);
      return {
        ok: false,
        message: '¡ Error al crear la tanda de penales, revise los logs del servidor !',
        penaltyShootout: null,
      };
    }
    console.log('ERROR CAUSE:', (error as Error).cause);
    console.log('ERROR MESSAGE:', (error as Error).message);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      penaltyShootout: null,
    };
  }
};
