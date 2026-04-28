'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchTeams = Promise<{
  ok: boolean;
  message: string;
  teams: {
    id: string;
    name: string;
  }[] | null;
}>;

export const fetchTeamsForCoach = async ({
  tournamentPermalink,
  category,
  format,
}: {
  tournamentPermalink: string,
  category: string,
  format: string,
}): ResponseFetchTeams => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-teams-for-coach');

  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        permalink: tournamentPermalink,
        category,
        format,
      },
      select: {
        id: true,
        teams: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
      },
    });

    if (!tournament) {
      return {
        ok: true,
        message: `¡ El torneo no existe con el enlace permanente: (${tournamentPermalink}) !`,
        teams: [],
      };
    }

    return {
      ok: true,
      message: '¡ Los equipos fueron obtenidos correctamente 👍 !',
      teams: tournament.teams,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('¡ Error al intentar obtener los equipos !');
      return {
        ok: false,
        message: error.message,
        teams: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado al obtener los equipos, revise los logs del servidor !',
      teams: null,
    };
  }
};
