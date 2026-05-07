'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TeamType = {
  id: string;
  name: string;
  permalink: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  teams: TeamType[];
}>;

export const fetchTeamsByTournamentAndCategoryAction = async ({
  tournamentPermalink,
  categoryPermalink,
}: {
  tournamentPermalink: string;
  categoryPermalink: string;
}): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag('fetch-teams-by-tournament');

  try {
    const tournament = await prisma.tournament.findFirst({
      where: {
        permalink: tournamentPermalink,
        category: categoryPermalink,
      },
      select: {
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
        ok: false,
        message: '! No se encontró el torneo ❌ ¡',
        teams: [],
      };
    }

    return {
      ok: true,
      message: '! Los equipos fueron obtenidos correctamente 👍',
      teams: tournament.teams.filter((team) => !team.name.toLowerCase().includes('descanso')),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los equipos');
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
