'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type TeamType = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  teams: TeamType[];
}>;

export const fetchTeamsAction = async (tournamentId: string): ResponseAction => {
  "use cache";

  cacheLife('days');
  cacheTag('public-teams');

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    select: { id: true },
  });

  if (!tournament) {
    return {
      ok: true,
      message: `! No hay un equipo con el enlace permanente ${tournamentId} ¡`,
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
