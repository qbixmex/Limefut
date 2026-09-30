'use server';

import { updateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/get-session';
import { createStandingsSchema } from '@/shared/schemas';
import { Prisma } from '@/generated/prisma/client';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

type DataType = {
  tournamentId: string | null;
  categoryId: string | null;
  teamId: string;
}[];

export const createStandingsAction = async (data: DataType): CreateResponseAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
    };
  }

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
        message: 'Las estadísticas fueron creadas correctamente',
      };
    });

    // Update Cache
    updateTag('admin-standings');
    updateTag('admin-tournaments-for-standings');
    updateTag('public-standings');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        if (error.meta) {
          console.log('ERROR METADATA:', error.meta);
        }

        return {
          ok: false,
          message: 'Hay campos duplicados, revise los logs del servidor',
        };
      }

      return {
        ok: false,
        message: 'Error al crear las estadísticas, revise los logs del servidor',
      };
    }

    if (error instanceof Error) {
      console.log('ERROR NAME:', error.name);
      console.log('ERROR CAUSE:', error.cause);
      console.log('ERROR MESSAGE:', error.message);

      return {
        ok: false,
        message: 'Error al crear las estadísticas, revise los logs del servidor',
      };
    }

    return {
      ok: false,
      message: 'Error inesperado, revise los logs del servidor',
    };
  }
};
