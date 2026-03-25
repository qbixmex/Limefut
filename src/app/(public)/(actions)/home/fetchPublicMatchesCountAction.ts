'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

type Options = Readonly<{
  timeZone?: string;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  matchesDates: {
    id: string;
    matchDate: string;
  }[];
}>;

export const fetchPublicMatchesAction = async (options?: Options): ResponseFetchAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-matches-count');

  const timeZone = options?.timeZone ?? 'America/Mexico_City';

  const now = new Date();
  const nowInZone = toZonedTime(now, timeZone);
  const todayInZone = new Date(nowInZone);
  todayInZone.setHours(0, 0, 0, 0);

  const startDate = new Date(todayInZone);
  startDate.setDate(todayInZone.getDate() - 7);
  const startDateUTC = fromZonedTime(startDate, timeZone);

  const endDate = new Date(todayInZone);
  endDate.setDate(todayInZone.getDate() + 7);
  endDate.setHours(23, 59, 59, 999);
  const endDateUTC = fromZonedTime(endDate, timeZone);

  try {
    const data = await prisma.match.findMany({
      where: {
        matchDate: {
          gte: startDateUTC,
          lte: endDateUTC,
        },
      },
      select: {
        id: true,
        matchDate: true,
      },
    });

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matchesDates: data.map((match) => {
        return {
          id: match.id,
          matchDate: match.matchDate
            ? match.matchDate.toISOString()
            : '',
        };
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
