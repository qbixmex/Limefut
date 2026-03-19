'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  matchesDates: string[];
}>;

export const fetchPublicMatchesAction = async (): ResponseFetchAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-matches-count');

  try {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);

    const data = await prisma.match.findMany({
      where: {
        status: { not: 'canceled' },
        matchDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { matchDate: 'asc' },
      select: {
        matchDate: true,
      },
    });

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matchesDates: data.map((match) => {
        return match.matchDate
          ? match.matchDate.toISOString()
          : '';
      }),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los encuentros');
      return {
        ok: false,
        message: error.message,
        matchesDates: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los encuentros, revise los logs del servidor',
      matchesDates: [],
    };
  }
};

export default fetchPublicMatchesAction;
