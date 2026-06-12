'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import type { PenaltyShootout } from '@/shared/interfaces';
import { SimplePenaltyShootoutsSchema } from '~/src/shared/schemas';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  penaltyShootout: PenaltyShootout | null;
}>;

export const createPlayoffSimplePenaltyShootoutAction = async (
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
      message: '¡ La tanda de penales no puede ser un empate !',
      penaltyShootout: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      // Verify that the match exists
      const playoffMatchExists = await transaction.playoffMatch.count({
        where: { id: shootoutVerified.data.matchId },
      });

      if (!playoffMatchExists) {
        return {
          ok: false,
          message: '¡ El encuentro con el id subministrado no existe !',
          penaltyShootout: null,
        };
      }

      let winnerTeamId = '';

      if (data.localGoals > data.visitorGoals) {
        winnerTeamId = data.localTeamId;
      } else {
        winnerTeamId = data.visitorTeamId;
      }

      const penaltyShootout = await transaction.penaltyShootout.create({
        data: {
          playoffMatchId: shootoutVerified.data.matchId,
          localTeamId: shootoutVerified.data.localTeamId,
          visitorTeamId: shootoutVerified.data.visitorTeamId,
          localGoals: shootoutVerified.data.localGoals,
          visitorGoals: shootoutVerified.data.visitorGoals,
          winnerTeamId,
          status: 'completed',
        },
      });

      return {
        ok: true,
        message: '¡ Tanda de penales creada correctamente 👍 !',
        penaltyShootout,
      };
    });

    // Refresh Cache
    updateTag('admin-playoff-matches');
    updateTag('admin-playoff-match');
    updateTag('public-playoff-matches');
    updateTag('public-playoff-match');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      console.log('NAME:', error.name);
      console.log('CAUSE:', error.cause);
      console.log('META:', error.meta);
      console.log('MESSAGE:', error.message);
      console.log(error.message);
      return {
        ok: false,
        message: '¡ Error al crear la tanda de penales, revise los logs del servidor !',
        penaltyShootout: null,
      };
    }
    console.log('Error Cause:', (error as Error).cause);
    console.log('Error Message:', (error as Error).message);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      penaltyShootout: null,
    };
  }
};
