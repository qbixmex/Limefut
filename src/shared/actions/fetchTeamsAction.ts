'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type TeamType = {
  id: string;
  name: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  teams: TeamType[];
}>;

export const fetchTeamsAction = async (tournamentId: string): ResponseAction => {
  "use cache";

  cacheLife('days');
  cacheTag('admin-teams-list');

  try {
    const teams = await prisma.team.findMany({
      where: {
        tournamentId,
        active: true,
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
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
