'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  data: DataType;
}>;

export type DataType = {
  tournament: {
    id: string;
    permalink: string;
    teams: TeamType[];
  } | null;
  results: ResultType[];
};

export type TeamType = {
  id?: string;
  name: string;
  permalink: string;
  category: string;
  format: string;
}

export type ResultType = {
  id: string;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: Date | null;
  status: string;
  localTeam: TeamType;
  visitorTeam: TeamType;
};

export const fetchResultsAction = async (
  tournamentPermalink: string,
  category: string,
  format: string,
): ResponseAction => {
  "use cache";

  cacheLife('days');
  cacheTag('public-matches');

  const tournament = await prisma.tournament.findFirst({
    where: {
      permalink: tournamentPermalink,
      category,
      format,
    },
    select: {
      id: true,
      permalink: true,
      teams: {
        select: {
          id: true,
          name: true,
          permalink: true,
          category: true,
          format: true,
        },
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!tournament) {
    return {
      ok: false,
      message: `! No se encontró el torneo ❌ ¡`,
      data: {
        tournament: null,
        results: [],
      },
    };
  }

  try {
    const results = await prisma.match.findMany({
      where: {
        tournamentId: tournament.id,
      },
      orderBy: { week: 'asc' },
      select: {
        id: true,
        localScore: true,
        visitorScore: true,
        matchDate: true,
        status: true,
        local: {
          select: {
            name: true,
            permalink: true,
            category: true,
            format: true,
          },
        },
        visitor: {
          select: {
            name: true,
            permalink: true,
            category: true,
            format: true,
          },
        },
      },
    });

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      data: {
        tournament: {
          id: tournament.id,
          permalink: tournament.permalink,
          teams: tournament.teams,
        },
        results: results.map((result) => ({
          id: result.id,
          localScore: result.localScore,
          visitorScore: result.visitorScore,
          matchDate: result.matchDate,
          status: result.status,
          localTeam: {
            name: result.local.name,
            permalink: result.local.permalink,
            category: result.local.category,
            format: result.local.format,
          },
          visitorTeam: {
            name: result.visitor.name,
            permalink: result.visitor.permalink,
            category: result.visitor.category,
            format: result.visitor.format,
          },
        })),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los encuentros");
      return {
        ok: false,
        message: error.message,
        data: {
          tournament: null,
          results: [],
        },
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los encuentros, revise los logs del servidor",
      data: {
        tournament: null,
        results: [],
      },
    };
  }
};
