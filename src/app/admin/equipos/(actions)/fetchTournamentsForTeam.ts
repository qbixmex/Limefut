'use server';

import prisma from "@/lib/prisma";

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  tournaments: {
    id: string;
    name: string;
  }[] | null;
}>;

export const fetchTournamentsForTeam = async (): ResponseFetchAction => {
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
        tournaments: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los torneos, revise los logs del servidor",
      tournaments: null,
    };
  }
};
