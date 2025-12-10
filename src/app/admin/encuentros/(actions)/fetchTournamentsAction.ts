'use server';

import prisma from "@/lib/prisma";

type OptionsType = {
  currentWeek?: number;
};

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  tournaments: {
    id: string;
    name: string;
  }[] | null;
}>;

export const fetchTournamentsAction = async (options?: OptionsType): ResponseFetchAction => {
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
        tournaments: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado, revise los logs del servidor",
      tournaments: null,
    };
  }
};
