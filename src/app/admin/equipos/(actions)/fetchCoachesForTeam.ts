'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  coaches: {
    id: string;
    name: string;
  }[] | null;
}>;

export const fetchCoachesForTeam = async (): ResponseFetchAction => {
  "use cache";

  cacheLife("days");
  cacheTag("admin-coaches-for-team");

  try {
    const coaches = await prisma.coach.findMany({
      orderBy: { name: 'asc' },
      where: { active: true },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      ok: true,
      message: '! Los entrenadores fueron obtenidos correctamente 👍',
      coaches,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los entrenadores");
      return {
        ok: false,
        message: error.message,
        coaches: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "¡ Error inesperado al obtener los entrenadores ❌ !, revise los logs del servidor",
      coaches: null,
    };
  }
};
