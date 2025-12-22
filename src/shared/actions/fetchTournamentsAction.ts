'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type TournamentType = {
  id: string;
  name: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  tournaments: TournamentType[];
}>;

export const fetchTournamentsAction = async (): ResponseAction => {
  "use cache";

  cacheLife('days');
  cacheTag('admin-tournaments-list');

  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { name: 'asc' },
      where: { active: true },
      select: {
        id: true,
        name: true,
      },
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
