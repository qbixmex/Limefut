'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  country: string | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
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
      ],
      where: { active: true },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        country: true,
        season: true,
        startDate: true,
        endDate: true,
      },
    });

    return {
      ok: true,
      message: '! Los torneos fueron obtenidos correctamente 👍',
      tournaments,
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
