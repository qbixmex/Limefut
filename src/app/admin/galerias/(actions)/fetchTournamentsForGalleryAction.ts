'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  tournaments: {
    id: string;
    name: string;
    category: string;
    format: string;
  }[];
}>;

export const fetchTournamentsForGalleryAction = async (): ResponseAction => {
  "use cache";

  cacheLife("days");
  cacheTag("admin-tournaments-for-gallery");

  try {
    const tournaments = await prisma.tournament.findMany({
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
      tournaments: tournaments,
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
      message: "Error inesperado al obtener los equipos, revise los logs del servidor",
      tournaments: [],
    };
  }
};
