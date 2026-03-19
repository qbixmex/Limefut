'use server';

import { updateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { createStandingsSchema } from '@/shared/schemas';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

type DataType = {
  tournamentId: string;
  teamId: string;
}[];

export const createStandingsAction = async (data: DataType): CreateResponseAction => {
  const standingsVerified = createStandingsSchema.safeParse(data);

  if (!standingsVerified.success) {
    return {
      ok: false,
      message: standingsVerified.error.message,
    };
  }

  const standingsData = standingsVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {
      await tx.standings.createMany({
        data: standingsData,
      });

      return {
        ok: true,
        message: '¡ Las estadísticas fueron creadas correctamente 👍 !',
      };
    });

    // Update Cache
    updateTag('admin-standings');
    updateTag('admin-tournaments-for-standings');
    updateTag('public-standings');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
        };
      }

      return {
        ok: false,
        message: '¡ Error al crear las estadísticas, revise los logs del servidor !',
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
    };
  }
};
