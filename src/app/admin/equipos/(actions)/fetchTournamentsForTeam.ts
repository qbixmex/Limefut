'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TournamentType = {
  id: string;
  name: string;
  categories: CATEGORY_TYPE[]
};

type CATEGORY_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  tournaments: TournamentType[];
}>;

export const fetchTournamentsForTeam = async (): ResponseFetchAction => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-tournaments-selector');

  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: [
        { name: 'asc' },
      ],
      select: {
        id: true,
        name: true,
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
