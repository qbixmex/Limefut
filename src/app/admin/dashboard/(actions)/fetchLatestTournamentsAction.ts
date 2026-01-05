'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

type Options = Readonly<{
  limit: number;
}>;

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  tournaments: {
    id: string;
    name: string;
    category: string;
    format: string;
  }[];
}>;

export const fetchLatestTournamentsAction = async ({ limit }: Options): Promise<ResponseFetch> => {
  "use cache";

  cacheLife('days');
  cacheTag('dashboard-tournaments');

  try {
    const tournaments = await prisma.tournament.findMany({
      where: { active: true },
      orderBy: { startDate: 'asc' },
      select: {
        id: true,
        name: true,
        category: true,
        format: true,
      },
      take: limit,
    });

    return {
      ok: true,
      message: '! Los torneos fueron obtenidos correctamente 👍',
      tournaments,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los torneos");
      return {
        ok: false,
        message: error.message,
        tournaments: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los torneos, revise los logs del servidor",
      tournaments: [],
    };
  }
};
