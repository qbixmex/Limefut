'use server';

import prisma from "@/lib/prisma";
import type { MATCH_STATUS } from "@/shared/enums";
import { cacheLife, cacheTag } from "next/cache";

type Options = Readonly<{
  nextMatches?: number;
  take?: number;
}>;

export type MatchResponse = {
  id: string;
  tournament: {
    name: string;
    permalink: string;
    currentWeek: number | null;
  },
  localTeam: {
    name: string;
    id: string;
    permalink: string;
    category: string | null;
    format: string | null;
    imageUrl: string | null,
  };
  visitorTeam: {
    name: string;
    id: string;
    permalink: string;
    imageUrl: string | null,
  };
  localScore: number;
  visitorScore: number;
  status: MATCH_STATUS;
  week: number | null;
  place: string | null;
  matchDate: Date | null;
};

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  matches: MatchResponse[];
  pagination: Pagination;
}>;

type Pagination = {
  nextMatches: number;
  totalPages: number;
};

export const fetchPublicMatchesAction = async (options?: Options): ResponseFetchAction => {
  "use cache";

  cacheLife('days');
  cacheTag('matches');

  let { nextMatches = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(nextMatches)) nextMatches = 1;
  if (isNaN(take)) take = 12;

  try {
    const data = await prisma.match.findMany({
      where: { status: "scheduled" },
      orderBy: { matchDate: 'asc' },
      take: take,
      skip: (nextMatches - 1) * take,
      select: {
        id: true,
        tournament: {
          select: {
            name: true,
            permalink: true,
            currentWeek: true,

          },
        },
        local: {
          select: {
            id: true,
            name: true,
            permalink: true,
            category: true,
            format: true,
            imageUrl: true,
          },
        },
        visitor: {
          select: {
            id: true,
            name: true,
            permalink: true,
            imageUrl: true,
          },
        },
        localScore: true,
        visitorScore: true,
        status: true,
        week: true,
        place: true,
        matchDate: true,
      },
    });

    const totalCount = await prisma.match.count({
      where: { status: "scheduled" },
    });

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matches: data.map((match) => ({
        id: match.id,
        tournament: match.tournament,
        localTeam: match.local,
        visitorTeam: match.visitor,
        localScore: match.localScore ?? 0,
        visitorScore: match.visitorScore ?? 0,
        status: match.status as MATCH_STATUS,
        week: match.week,
        place: match.place,
        matchDate: match.matchDate,
      })),
      pagination: {
        nextMatches: nextMatches,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los encuentros");
      return {
        ok: false,
        message: error.message,
        matches: [],
        pagination: {
          nextMatches: 0,
          totalPages: 0,
        },
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los encuentros, revise los logs del servidor",
      matches: [],
      pagination: {
        nextMatches: 0,
        totalPages: 0,
      },
    };
  }
};

export default fetchPublicMatchesAction;
