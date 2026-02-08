'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

type OptionsType = {
  currentWeek?: number;
};

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  tournaments: {
    id: string;
    name: string;
    category: string;
    format: string;
  }[];
}>;

export const fetchTournamentsForMatchAction = async (options?: OptionsType): ResponseFetchAction => {
  "use cache";
  
  cacheLife("days");
  cacheTag("admin-tournaments-for-match");

  const { currentWeek } = options ?? {};

  try {
    const tournaments = await prisma.tournament.findMany({
      where: {
        active: true,
        ...(currentWeek && (currentWeek > 0) && { currentWeek }),
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        category: true,
        format: true,
      },
    });

    return {
      ok: true,
      message: '! Los torneos fueron obtenidos correctamente 👍',
      tournaments,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los torneos para encuentros:");
      return {
        ok: false,
        message: error.message,
        tournaments: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado, revise los logs del servidor",
      tournaments: [],
    };
  }
};
