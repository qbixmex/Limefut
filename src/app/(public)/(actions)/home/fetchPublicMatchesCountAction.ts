'use server';

import prisma from "@/lib/prisma";
import { cacheLife } from "next/cache";

type Options = Readonly<{
  take?: number;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  matchesDates: string[];
}>;

export const fetchPublicMatchesAction = async (options?: Options): ResponseFetchAction => {
  "use cache";

  cacheLife('hours');

  let { take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(take)) take = 12;

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
        matchDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { matchDate: 'desc' },
      take,
      select: {
        matchDate: true,
      }
    });

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matchesDates: data.map((match) => match.matchDate.toISOString()),
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

export default fetchPublicMatchesAction;
