'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

type Options = Readonly<{
  timeZone?: string;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  matchesDates: string[];
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

  const futureStatusFilter: Prisma.MatchWhereInput['OR'] = [
    { status: 'scheduled' },
    { status: 'inProgress' },
    { status: 'postPosed' },
  ];

  const startDate = new Date(todayInZone);
  startDate.setDate(todayInZone.getDate() - 7);
  const startDateUTC = fromZonedTime(startDate, timeZone);

  const pastEndDate = new Date(todayInZone);
  pastEndDate.setDate(todayInZone.getDate() - 1);
  pastEndDate.setHours(23, 59, 59, 999);
  const pastEndDateUTC = fromZonedTime(pastEndDate, timeZone);

  const futureStartDate = new Date(todayInZone);
  futureStartDate.setHours(0, 0, 0, 0);
  const futureStartDateUTC = fromZonedTime(futureStartDate, timeZone);

  const futureEndDate = new Date(todayInZone);
  futureEndDate.setDate(todayInZone.getDate() + 7);
  futureEndDate.setHours(23, 59, 59, 999);
  const futureEndDateUTC = fromZonedTime(futureEndDate, timeZone);

  try {
    const [pastMatches, futureMatches] = await Promise.all([
      prisma.match.findMany({
        where: {
          matchDate: {
            gte: startDateUTC,
            lte: pastEndDateUTC,
          },
        },
        select: {
          matchDate: true,
        },
      }),
      prisma.match.findMany({
        where: {
          OR: futureStatusFilter,
          matchDate: {
            gte: futureStartDateUTC,
            lte: futureEndDateUTC,
          },
        },
        select: {
          matchDate: true,
        },
      }),
    ]);

    const allMatches = [...pastMatches, ...futureMatches];

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matchesDates: allMatches.map((match) => {
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
