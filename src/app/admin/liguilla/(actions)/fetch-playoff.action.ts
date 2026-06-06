'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  playoff: PLAYOFF_TYPE | null;
}>;

export type PLAYOFF_TYPE = {
  id: string;
  teamIds: string[];
  startingRound: string;
  tournament: {
    id: string;
    name: string;
    permalink: string;
  };
  category: {
    id: string;
    name: string;
    permalink: string;
  } | null;
};

export const fetchPlayoffAction = async ({
  authenticatedUserId,
  authenticatedUserRoles,
  playoffId,
} : {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  playoffId: string;
}): ResponseAction => {
  'use cache';

  cacheLife('max');
  cacheTag('admin-tournaments');

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
      playoff: null,
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos para realizar esta acción !',
      playoff: null,
    };
  }

  try {
    const playoff = await prisma.playoff.findFirst({
      where: { id: playoffId },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        teamIds: true,
        startingRound: true,
        tournament: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
      },
    });

    return {
      ok: true,
      message: '! La liguilla fue obtenida correctamente 👍 !',
      playoff,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('¡ Error al intentar obtener la liguilla');
      return {
        ok: false,
        message: error.message,
        playoff: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      playoff: null,
    };
  }
};
