'use server';

import prisma from "@/lib/prisma";

export type TournamentType = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
};

export type ResponseFetchTournaments = Promise<{
  ok: boolean;
  message: string;
  tournaments: TournamentType[] | null;
}>;

export const fetchTournamentsAction = async (userRole: string[] | null): ResponseFetchTournaments => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      tournaments: null,
    };
  }

  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { name: 'asc' },
      where: { active: true },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        season: true,
        startDate: true,
        endDate: true,
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
