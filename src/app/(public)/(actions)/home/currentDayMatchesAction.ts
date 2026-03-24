'use server';

import type { Prisma } from '@/generated/prisma/client';
import { cacheLife, cacheTag } from 'next/cache';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

import prisma from '@/lib/prisma';

type Options = Readonly<{
  take?: number;
  selectedDay?: string;
  timeZone?: string;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  matchesDates: string[];
}>;

export const CurrentDayMatchesAction = async (options?: Options): ResponseFetchAction => {
  'use cache';

  cacheLife('days');
  cacheTag('matches');

  let { take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(take)) take = 12;

  const selectedDay = options?.selectedDay;
  const timeZone = options?.timeZone ?? 'America/Mexico_City';

  const now = new Date();
  const nowInZone = toZonedTime(now, timeZone);
  const todayInZone = new Date(nowInZone);
  todayInZone.setHours(0, 0, 0, 0);

  let dateFilter: Record<string, Date>;
  let isPastDate = false;

  if (selectedDay) {
    const selectedDateInZone = toZonedTime(new Date(selectedDay + 'T00:00:00'), timeZone);
    isPastDate = selectedDateInZone < todayInZone;

    const startOfDayUTC = fromZonedTime(new Date(selectedDay + 'T00:00:00'), timeZone);

    const endOfDayUTC = fromZonedTime(new Date(selectedDay + 'T00:00:00'), timeZone);
    endOfDayUTC.setHours(23, 59, 59, 999);

    dateFilter = { gte: startOfDayUTC, lte: endOfDayUTC };
  } else {
    const startOfToday = fromZonedTime(
      new Date(nowInZone.getFullYear(), nowInZone.getMonth(), nowInZone.getDate(), 0, 0, 0, 0),
      timeZone,
    );

    const endOfToday = fromZonedTime(
      new Date(nowInZone.getFullYear(), nowInZone.getMonth(), nowInZone.getDate(), 23, 59, 59, 999),
      timeZone,
    );

    dateFilter = { gte: startOfToday, lte: endOfToday };
  }

  const statusFilter: Prisma.MatchWhereInput['OR'] = isPastDate
    ? undefined
    : [
        { status: 'scheduled' },
        { status: 'inProgress' },
        { status: 'postPosed' },
      ];

  try {
    const data = await prisma.match.findMany({
      where: {
        ...(statusFilter && { OR: statusFilter }),
        matchDate: dateFilter,
      },
      orderBy: { matchDate: 'desc' },
      take,
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

export default CurrentDayMatchesAction;
