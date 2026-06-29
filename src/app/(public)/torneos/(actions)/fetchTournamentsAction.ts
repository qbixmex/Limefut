'use server';

import prisma from '@/lib/prisma';
import type { STAGE_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  country: string | null;
  cities: string[];
  season: string | null;
  stage: STAGE_TYPE;
  startDate: Date;
  endDate: Date;
  categories: {
    id: string;
    name: string;
    permalink: string;
  }[];
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  tournaments: TOURNAMENT_TYPE[];
}>;

export const fetchTournamentsAction = async (): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-tournaments');

  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: [
        { name: 'asc' },
        { season: 'asc' },
        { category: 'asc' },
        { format: 'asc' },
      ],
      where: { active: true },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        country: true,
        cities: true,
        season: true,
        stage: true,
        startDate: true,
        endDate: true,
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
