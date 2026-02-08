'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  teams: {
    id: string;
    name: string;
  }[];
}>;

export const fetchTeamsForGalleryAction = async (): ResponseAction => {
  "use cache";

  cacheLife("days");
  cacheTag("admin-teams-for-gallery");

  try {
    const teams = await prisma.team.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        permalink: true,
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
