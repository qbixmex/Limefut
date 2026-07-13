'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchTeams = Promise<{
  ok: boolean;
  message: string;
  teams: {
    id: string;
    name: string;
    permalink: string;
  }[];
}>;

export const fetchTeamsForCoach = async ({
  tournamentPermalink,
  categoryPermalink,
}: {
  tournamentPermalink: string,
  categoryPermalink: string,
}): ResponseFetchTeams => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-teams-for-coach');

  try {
    const teams = await prisma.team.findMany({
      where: {
        tournament: {
          permalink: tournamentPermalink,
        },
        category: {
          permalink: categoryPermalink,
        },
      },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });

    return {
      ok: true,
      message: '¡ Los equipos fueron obtenidos correctamente 👍 !',
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
