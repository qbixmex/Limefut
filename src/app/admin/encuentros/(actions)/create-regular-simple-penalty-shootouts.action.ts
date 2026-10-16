'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { Prisma } from '@/generated/prisma/client';
import type { PenaltyShootout } from '@/shared/interfaces';
import { SimplePenaltyShootoutsSchema } from '~/src/shared/schemas';
import { requireAdmin } from '@/lib/get-session';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  penaltyShootout: PenaltyShootout | null;
}>;

export const createRegularSimplePenaltyShootoutAction = async (
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
    localGoals: formData.get('localGoals')
      ? Number(formData.get('localGoals'))
      : undefined,
    visitorGoals: formData.get('visitorGoals')
      ? Number(formData.get('visitorGoals'))
      : undefined,
  };

  const shootoutVerified = SimplePenaltyShootoutsSchema.safeParse(rawData);

  if (!shootoutVerified.success) {
    return {
      ok: false,
      message: shootoutVerified.error.issues[0].message,
      penaltyShootout: null,
    };
  }

  const data = shootoutVerified.data;

  // Verify if shootouts is not a draw
  if (data.localGoals === data.visitorGoals) {
    return {
      ok: false,
      message: 'La tanda de penales no puede ser un empate',
      penaltyShootout: null,
    };
  }

  // Verify that the match exists
  const match = await prisma.match.findFirst({
    where: { id: shootoutVerified.data.matchId },
  });

  if (!match) {
    return {
      ok: false,
      message: 'El encuentro con el id subministrado no existe',
      penaltyShootout: null,
    };
  }

  try {
    let winnerTeamId = '';

    if (data.localGoals > data.visitorGoals) {
      winnerTeamId = data.localTeamId;
    } else {
      winnerTeamId = data.visitorTeamId;
    }

    const penaltyShootout = await prisma.penaltyShootout.create({
      data: {
        matchId: shootoutVerified.data.matchId,
        localTeamId: shootoutVerified.data.localTeamId,
        visitorTeamId: shootoutVerified.data.visitorTeamId,
        localGoals: shootoutVerified.data.localGoals,
        visitorGoals: shootoutVerified.data.visitorGoals,
        winnerTeamId,
        status: 'completed',
      },
    });

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
      penaltyShootout,
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

      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('META:', error.meta);
      console.log('MESSAGE:', error.message);
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
