'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  teams: TEAM_TYPE[];
}>;

type TEAM_TYPE = {
  id: string;
  name: string;
  permalink: string;
}

export const fetchTeamsAction = async ({
  authenticatedUserId,
  authenticatedUserRoles,
  tournamentPermalink,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  tournamentPermalink: string;
}): ResponseAction => {
  'use cache';

  cacheLife('max');
  cacheTag('admin-teams');

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
      teams: [],
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos para realizar esta acción !',
      teams: [],
    };
  }

  try {
    const teams = await prisma.team.findMany({
      where: {
        tournament: { permalink: tournamentPermalink },
      },
      orderBy: { name: 'desc' },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });

    return {
      ok: true,
      message: '! Los equipos fueron obtenidos correctamente 👍 !',
      teams,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('¡ Error al intentar obtener los equipos !');
      return {
        ok: false,
        message: error.message,
        teams: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      teams: [],
    };
  }
};
