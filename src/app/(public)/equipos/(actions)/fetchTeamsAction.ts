'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type TeamType = {
  id: string;
  name: string;
  permalink: string;
  category: string;
  format: string;
  imageUrl: string | null;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  teams: TeamType[];
}>;

export const fetchTeamsAction = async (
  permalink: string,
  category: string,
  format: string,
): ResponseAction => {
  "use cache";

  cacheLife('days');
  cacheTag('public-teams');

  const tournament = await prisma.tournament.findFirst({
    where: {
      permalink,
      category,
      format,
    },
    select: {
      id: true,
      permalink: true,
    },
  });

  if (!tournament) {
    return {
      ok: false,
      message: `! No existe el torneo con el enlace permanente ${permalink} ¡`,
      teams: [],
    };
  }

  try {
    const teams = await prisma.team.findMany({
      orderBy: { name: 'asc' },
      where: {
        active: true,
        tournamentId: tournament.id,
      },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        category: true,
        format: true,
      },
    });

    return {
      ok: true,
      message: '! Los equipos fueron obtenidos correctamente 👍',
      teams,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los equipos");
      return {
        ok: false,
        message: error.message,
        teams: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los equipos, revise los logs del servidor",
      teams: [],
    };
  }
};
