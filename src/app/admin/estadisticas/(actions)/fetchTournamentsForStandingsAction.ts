'use server';

import prisma from '@/lib/prisma';
import type { STAGE_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
  stage: STAGE_TYPE;
  categories: {
    id: string;
    name: string;
    permalink: string;
  }[];
};

export type ResponseFetchTournaments = Promise<{
  ok: boolean;
  message: string;
  tournaments: TOURNAMENT_TYPE[];
}>;

export const fetchTournamentsForStandingsAction = async (userRoles: string[] | null)
  : ResponseFetchTournaments => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-tournaments-for-standings');

  if ((userRoles !== null) && (!userRoles.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      tournaments: [],
    };
  }

  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: [
        { name: 'asc' },
        { category: 'desc' },
        { format: 'desc' },
      ],
      where: { active: true },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        season: true,
        startDate: true,
        endDate: true,
        stage: true,
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                permalink: true,
              },
            },
          },
        },
      },
    });

    return {
      ok: true,
      message: '! Los torneos fueron obtenidos correctamente 👍',
      tournaments: tournaments.map(tournament => ({
        ...tournament,
        categories: tournament.categories.map(tc => tc.category),
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los torneos');
      return {
        ok: false,
        message: error.message,
        tournaments: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los torneos, revise los logs del servidor',
      tournaments: [],
    };
  }
};
