'use server';

import prisma from '@/lib/prisma';
import type { PLAYOFF_ROUND_TYPE } from '@/shared/enums';
import { CreatePlayoffsSchema } from '@/shared/schemas';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { updateTag } from 'next/cache';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  playoff: {
    id: string;
  } | null;
}>;

export const createPlayoffAction = async ({
  formData,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  formData: FormData;
}): CreateResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      playoff: null,
    };
  }

  if (
    (authenticatedUserRoles && authenticatedUserRoles.length > 0) &&
    (!authenticatedUserRoles.includes('admin'))
  ) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      playoff: null,
    };
  }

  const rawData = {
    tournament: formData.get('tournament') ?? '',
    category: formData.get('category') ?? '',
    teamsIds: JSON.parse(formData.get('teamsIds') as string | null ?? '[]'),
    startingRound: formData.get('startingRound') ?? '',
  };

  const playoffVerified = CreatePlayoffsSchema.safeParse(rawData);

  if (!playoffVerified.success) {
    console.log(playoffVerified.error.message);
    return {
      ok: false,
      message: playoffVerified.error.message,
      playoff: null,
    };
  }

  const {
    tournament: tournamentPermalink,
    category: categoryPermalink,
    ...playoffToSave
  } = playoffVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const tournament = await transaction.tournament.findFirst({
        where: { permalink: tournamentPermalink },
        select: { id: true },
      });

      if (!tournament) {
        return {
          ok: false,
          message: `¡ El torneo: "${tournamentPermalink}" no existe !`,
          playoff: null,
        };
      }

      const category = await transaction.category.findFirst({
        where: { permalink: categoryPermalink },
        select: { id: true },
      });

      if (!category) {
        return {
          ok: false,
          message: `¡ La categoría con en enlace permanente "${categoryPermalink}" no existe !`,
          playoff: null,
        };
      }

      const playoff = await transaction.playoff.create({
        data: {
          tournamentId: tournament.id,
          categoryId: category.id,
          teamIds: playoffToSave.teamsIds,
          startingRound: playoffToSave.startingRound as PLAYOFF_ROUND_TYPE,
        },
        select: {
          id: true,
          teamIds: true,
          tournamentId: true,
          categoryId: true,
        },
      });

      return {
        ok: true,
        message: '¡ Liguilla creada correctamente 👍 !',
        playoff,
      };
    });

    // Update Cache
    updateTag('admin-playoffs');
    updateTag('admin-playoff');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        if (error.meta) {
          console.log('ERROR METADATA:', error.meta);
        }

        return {
          ok: false,
          message: '¡ Hay campos duplicados, revise los logs del servidor !',
          playoff: null,
        };
      }

      console.log('NAME:', error.name);
      console.log('CAUSE:', error.cause);
      console.log('MESSAGE:', error.message);
      console.log(error.message);

      return {
        ok: false,
        message: '¡ Error al crear la liguilla, revise los logs del servidor !',
        playoff: null,
      };
    }

    if (error instanceof Error) {
      console.log('ERROR NAME:', error.name);
      console.log('ERROR CAUSE:', error.cause);
      console.log('ERROR MESSAGE:', error.message);

      return {
        ok: false,
        message: '¡ Error al crear la cancha, revise los logs del servidor !',
        playoff: null,
      };
    }

    console.log('ERROR NAME:', (error as Error).name);
    console.log('ERROR CAUSE:', (error as Error).cause);
    console.log('ERROR MESSAGE:', (error as Error).message);

    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      playoff: null,
    };
  }
};
