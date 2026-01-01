'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type MatchType = {
  id: string;
  tournament: {
    name: string;
    permalink: string;
    group: string | null;
    division: string | null;
  };
  localScore: number | null;
  visitorScore: number | null;
  matchDate: Date | null;
  week: number | null;
  status: string;
  local: {
    name: string;
    permalink: string;
  };
  visitor: {
    name: string;
    permalink: string;
  };
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  matches: MatchType[];
}>;

export const fetchResultsAction = async (tournamentId: string): ResponseAction => {
  "use cache";

  cacheLife('days');
  cacheTag('public-results');

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    select: { id: true },
  });

  if (!tournament) {
    return {
      ok: false,
      message: `! No existe el torneo con el id: ${tournamentId} ¡`,
      matches: [],
    };
  }

  try {
    const matches = await prisma.match.findMany({
      where: {
        tournamentId: tournament.id,
      },
      orderBy: { week: 'asc' },
      select: {
        id: true,
        localScore: true,
        visitorScore: true,
        matchDate: true,
        week: true,
        status: true,
        tournament: {
          select: {
            name: true,
            permalink: true,
            group: true,
            division: true,
          },
        },
        local: {
          select: {
            name: true,
            permalink: true,
          },
        },
        visitor: {
          select: {
            name: true,
            permalink: true,
          },
        },
      },
    });

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matches,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los encuentros");
      return {
        ok: false,
        message: error.message,
        matches: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los encuentros, revise los logs del servidor",
      matches: [],
    };
  }
};
