'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  tournaments: {
    id: string;
    name: string;
    permalink: string;
  }[];
}>;

export const fetchTournamentsForMatchAction = async (): ResponseFetchAction => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-tournaments-for-match');

  try {
    const tournaments = await prisma.tournament.findMany({
      where: { active: true },
      orderBy: [
        { name: 'asc' },
      ],
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });

    return {
      ok: true,
      message: '! Los torneos fueron obtenidos correctamente 👍',
      tournaments,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los torneos para encuentros:');
      return {
        ok: false,
        message: error.message,
        tournaments: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado, revise los logs del servidor',
      tournaments: [],
    };
  }
};
