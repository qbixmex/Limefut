'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  teams: TEAM_TYPE[];
}>;

export type TEAM_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export const fetchPublicTeamsAction = async ({
  categoryPermalink,
} : {
  categoryPermalink: string;
}): ResponseAction => {
  'use cache';

  cacheLife('max');
  cacheTag('public-teams');

  try {
    const teams = await prisma.team.findMany({
      where: {
        tournament: { active: true },
        category: { permalink: categoryPermalink },
      },
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
      message: '¡ Error inesperado al obtener los equipos, revise los logs del servidor !',
      teams: [],
    };
  }
};
