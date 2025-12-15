'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import type { PenaltyShootout } from "@/shared/interfaces";
import { createPenaltyShootoutSchema } from "~/src/shared/schemas";

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  penaltyShootout: PenaltyShootout | null;
}>;

export const createPenaltyShootoutAction = async (
  formData: FormData,
  userRole: string[] | null,
): CreateResponseAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
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
    visitorPlayerId: formData.get('visitorPlayerId') as string,
  };

  const shootoutVerified = createPenaltyShootoutSchema.safeParse(rawData);

  if (!shootoutVerified.success) {
    return {
      ok: false,
      message: shootoutVerified.error.message,
      penaltyShootout: null,
    };
  }

  const { matchId, ...shootoutToSave } = shootoutVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      // Verificar que el match existe
      const match = await transaction.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        return {
          ok: false,
          message: `¡ El encuentro con el ID: "${matchId}" no existe !`,
          penaltyShootout: null,
        };
      }

      // Obtener el penalty shootout existente
      let penaltyShootout = await transaction.penaltyShootout.findUnique({
        where: { matchId },
        include: {
          kicks: {
            orderBy: { order: 'desc' },
            take: 1,
          },
        },
      });

      // Obtener el último orden de penalty kick
      let nextOrder = 1;
      if (penaltyShootout && penaltyShootout.kicks.length > 0) {
        nextOrder = penaltyShootout.kicks[0].order + 1;
      }

      // Si no existe penalty shootout, crearlo
      if (!penaltyShootout) {
        penaltyShootout = await transaction.penaltyShootout.create({
          data: {
            matchId,
            localTeamId: shootoutToSave.localTeamId,
            visitorTeamId: shootoutToSave.visitorTeamId,
          },
          include: { kicks: true },
        });
        nextOrder = 1;
      }

      // Crear los nuevos penalty kicks con los órdenes consecutivos
      const createdPenaltyShootout = await transaction.penaltyShootout.update({
        where: { id: penaltyShootout.id },
        data: {
          kicks: {
            create: [
              {
                teamId: shootoutToSave.localTeamId,
                playerId: shootoutToSave.localPlayerId,
                order: nextOrder,
              },
              {
                teamId: shootoutToSave.visitorTeamId,
                playerId: shootoutToSave.visitorPlayerId,
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
        penaltyShootout: createdPenaltyShootout,
      };
    });

    // Refresh Cache
    updateTag('matches');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          penaltyShootout: null,
        };
      }
      console.log("CAUSE:", error.cause);
      console.log("NAME:", error.name);
      console.log("META:", error.meta);
      console.log("MESSAGE:", error.message);
      console.log(error.message);
      return {
        ok: false,
        message: '¡ Error al crear la tanda de penales, revise los logs del servidor !',
        penaltyShootout: null,
      };
    }
    console.log((error as Error).message);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      penaltyShootout: null,
    };
  }
};
