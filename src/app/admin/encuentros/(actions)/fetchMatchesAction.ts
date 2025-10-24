'use server';

import prisma from "@/lib/prisma";
import { MATCH_STATUS } from "@/shared/enums";
import type { Pagination } from "@/shared/interfaces";

type Options = Readonly<{
  page?: number;
  take?: number;
}>;

type Team = {
  name: string;
  permalink: string;
};

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  matches: {
    id: string;
    localTeam: Team;
    visitorTeam: Team;
    localScore: number;
    visitorScore: number;
    status: MATCH_STATUS;
    week: number;
    place: string;
    matchDate: Date;
  }[] | null;
  pagination: Pagination | null;
}>;

export const fetchMatchesAction = async (options?: Options): ResponseFetchAction => {
  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  try {
    const matches = await prisma.match.findMany({
      orderBy: { matchDate: 'desc' },
      take: take,
      skip: (page - 1) * take,
      select: {
        id: true,
        local: {
          select: {
            name: true,
            permalink: true,
          }
        },
        visitor: {
          select: {
            name: true,
            permalink: true,
          }
        },
        localScore: true,
        visitorScore: true,
        status: true,
        week: true,
        place: true,
        matchDate: true,
      }
    });

    const totalCount = await prisma.match.count();

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matches: matches.map((match) => ({
        id: match.id,
        localTeam: {
          name: match.local.name,
          permalink: match.local.permalink,
        },
        visitorTeam: {
          name: match.visitor.name,
          permalink: match.visitor.permalink,
        },
        localScore: match.localScore ?? 0,
        visitorScore: match.visitorScore ?? 0,
        status: match.status as MATCH_STATUS,
        week: match.week,
        place: match.place,
        matchDate: match.matchDate,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los encuentros");
      return {
        ok: false,
        message: error.message,
        matches: null,
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los encuentros, revise los logs del servidor",
      matches: null,
      pagination: null,
    };
  }
};
