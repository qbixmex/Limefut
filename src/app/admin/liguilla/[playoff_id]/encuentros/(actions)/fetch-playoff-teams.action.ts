'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  teams: TEAM_TYPE[];
}>;

export type TEAM_TYPE = {
  id: string;
  name: string;
};

export const fetchPlayoffTeamsAction = async ({
  authenticatedUserId,
  authenticatedUserRoles,
  playoffId,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  playoffId: string;
}): ResponseFetchAction => {
  'use cache';

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción  ❌ !',
      teams: [],
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción  ❌ !',
      teams: [],
    };
  }

  cacheLife('days');
  cacheTag('admin-playoff-teams');

  try {
    const playoffs = await prisma.playoff.findFirst({
      where: { id: playoffId },
      select: { teamIds: true },
    });

    if (!playoffs) {
      return {
        ok: false,
        message: '¡ No se pudo encontrar la liguilla ❌ !',
        teams: [],
      };
    }

    const teams = await prisma.team.findMany({
      where: { id: { in: playoffs.teamIds } },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      ok: true,
      message: '! Los equipos de liguilla fueron obtenidos correctamente 👍',
      teams,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los encuentros');
      return {
        ok: false,
        message: error.message,
        teams: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los equipos, revise los logs del servidor',
      teams: [],
    };
  }
};
