'use server';

import { cacheLife, cacheTag } from 'next/cache';

import prisma from '@/lib/prisma';

type Options = Readonly<{
  take?: number;
  timeZone?: string;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  matchesDates: string[];
}>;


export const CurrentDayMatchesAction = async (options?: Options): ResponseFetchAction => {
  "use cache";

  cacheLife('days');
  cacheTag('matches');

  let { take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(take)) take = 12;

  const timeZone = options?.timeZone ?? 'America/Mexico_City';

  const now = new Date();
  const localTime = new Date(now.toLocaleString('en-US', { timeZone }));

  const startOfToday = new Date(
    localTime.getFullYear(),
    localTime.getMonth(),
    localTime.getDate(),
    0, 0, 0, 0,
  );
  const endOfToday = new Date(
    localTime.getFullYear(),
    localTime.getMonth(),
    localTime.getDate(),
    23, 59, 59, 999,
  );

  try {
    const data = await prisma.match.findMany({
      where: {
        OR: [
          { status: 'scheduled' },
          { status: 'inProgress' },
        ],
        matchDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
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
      console.log("Error al intentar obtener los encuentros");
      return {
        ok: false,
        message: error.message,
        matchesDates: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los encuentros, revise los logs del servidor",
      matchesDates: [],
    };
  }
};

export default CurrentDayMatchesAction;
