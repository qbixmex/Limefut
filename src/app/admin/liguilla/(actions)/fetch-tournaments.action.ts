'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  tournaments: TOURNAMENT_TYPE[];
}>;

export const fetchTournamentsAction = async ({
  authenticatedUserId,
  authenticatedUserRoles,
} : {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}): ResponseAction => {
  'use cache';

  cacheLife('max');
  cacheTag('admin-tournaments');

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
      tournaments: [],
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos para realizar esta acción !',
      tournaments: [],
    };
  }

  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: {
        name: 'desc',
      },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });

    return {
      ok: true,
      message: '! Los torneos fueron obtenidos correctamente 👍 !',
      tournaments,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('¡ Error al intentar obtener los torneos !');
      return {
        ok: false,
        message: error.message,
        tournaments: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      tournaments: [],
    };
  }
};
