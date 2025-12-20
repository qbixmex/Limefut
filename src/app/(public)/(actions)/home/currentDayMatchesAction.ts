'use server';

import { endOfDay, startOfDay } from "date-fns";
import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

type Options = Readonly<{
  take?: number;
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

  try {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const endOfToday = endOfDay(now);

    const data = await prisma.match.findMany({
      where: {
        status: 'scheduled',
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
