'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type ResponseFetchTeams = Promise<{
  ok: boolean;
  message: string;
  teams: {
    id: string;
    name: string;
  }[] | null;
}>;

export const fetchTeamsForPlayer = async (): ResponseFetchTeams => {
  "use cache";
  
  cacheLife("days");
  cacheTag("admin-teams-for-player");

  try {
    const teams = await prisma.team.findMany({
      orderBy: { name: 'asc' },
      where: { active: true },
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
        teams: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los equipos, revise los logs del servidor",
      teams: null,
    };
  }
};
