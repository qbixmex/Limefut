'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { MATCH_MODE } from '@/shared/enums';
import { Prisma } from '@/generated/prisma/client';
import type { PenaltyShootout } from '@/shared/interfaces';
import { createPenaltyShootoutSchema } from '~/src/shared/schemas';
import { requireAdmin } from '@/lib/get-session';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  penaltyShootout: PenaltyShootout | null;
}>;

export const createRegularPenaltyShootoutAction = async (
  formData: FormData,
): CreateResponseAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
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

  // Verify that the match exists
  const match = await prisma.match.findFirst({
    where: { id: matchId },
    select: {
      mode: true,
      tournamentId: true,
      categoryId: true,
    },
  });

  if (!match) {
    return {
      ok: false,
      message: `El encuentro con el ID: "${matchId}" no existe`,
      penaltyShootout: null,
    };
  }

  try {
    // Get the existing penalty shootout
    let penaltyShootout = await prisma.penaltyShootout.findFirst({
      where: { matchId },
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
      penaltyShootout = await prisma.penaltyShootout.create({
        data: {
          matchId,
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
    const updatedShootout = await prisma.penaltyShootout.update({
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

    if (
      updatedShootout.winnerTeamId !== null &&
      updatedShootout.status === 'completed' &&
      // Friendly matches never count towards the standings table
      match.mode === MATCH_MODE.LEAGUE
    ) {
      await prisma.standings.upsert({
        where: {
          tournamentId_teamId_categoryId: {
            tournamentId: match.tournamentId,
            teamId: updatedShootout.winnerTeamId,
            categoryId: match.categoryId!,
          },
        },
        update: {
          additionalPoints: {
            increment: 1,
          },
          totalPoints: {
            increment: 1,
          },
        },
        create: {
          teamId: updatedShootout.winnerTeamId,
          tournamentId: match.tournamentId,
          categoryId: match.categoryId,
          additionalPoints: 1,
          totalPoints: 1,
        },
      });
    }

    // Refresh Cache
    updateTag('admin-matches');
    updateTag('admin-match');
    updateTag('public-matches');
    updateTag('public-results');
    updateTag('public-results-roles');
    updateTag('public-result-details');
    updateTag('public-matches-count');
    updateTag('public-team-standings');
    updateTag('public-playoff-matches');
    updateTag('public-playoff');

    return {
      ok: true,
      message: 'Tanda de penales creada correctamente',
      penaltyShootout: updatedShootout,
    };
  } catch (error) {
    let errorMessage = 'Error inesperado';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2001') {
        errorMessage = 'La tanda de penales no existe';
      } else if (error.code === 'P2002') {
        errorMessage = 'Hay campos duplicados';
      } else {
        errorMessage = 'Error al crear la tanda de penales';
      }

      console.log('='.repeat(20) + ' PRISMA ERROR ' + '='.repeat(20));
      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('META:', error.meta);
      console.log('MESSAGE:', error.message);
      console.log('='.repeat(54));
    } else if (error instanceof Error) {
      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('MESSAGE:', error.message);
    } else {
      console.log(error);
    }

    return {
      ok: false,
      message: `${errorMessage}, revise los logs del servidor`,
      penaltyShootout: null,
    };
  }
};
