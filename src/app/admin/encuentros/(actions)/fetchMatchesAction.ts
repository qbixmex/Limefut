'use server';

import type { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { MATCH_STATUS } from "@/shared/enums";
import type { Pagination } from "@/shared/interfaces";
import { cacheLife, cacheTag } from "next/cache";

type Options = Readonly<{
  tournamentId: string;
  searchTerm: string;
  page?: number;
  take?: number;
  sortMatchDate?: 'asc' | 'desc';
  sortWeek?: 'asc' | 'desc';
}>;

export type Match = {
  id: string;
  localTeam: Team;
  visitorTeam: Team;
  localScore: number;
  visitorScore: number;
  status: MATCH_STATUS;
  week: number | null;
  place: string | null;
  matchDate: Date | null;
};

type Team = {
  id: string;
  name: string;
  permalink: string;
};

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  matches: Match[];
  pagination: Pagination;
}>;

export const fetchMatchesAction = async (options?: Options): ResponseFetchAction => {
  "use cache";
  
  cacheLife('days');
  cacheTag('admin-matches');

  const tournamentId = options?.tournamentId;
  let { page = 1, take = 12 } = options ?? {};
  const sortMatchDate = options?.sortMatchDate;
  const sortWeek = options?.sortWeek;

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const statusMap: Record<string, MATCH_STATUS> = {
    "programado": MATCH_STATUS.SCHEDULED,
    "en progreso": MATCH_STATUS.INPROGRESS,
    "finalizado": MATCH_STATUS.COMPLETED,
    "pospuesto": MATCH_STATUS.POST_POSED,
    "cancelado": MATCH_STATUS.CANCELED,
  };

  const whereCondition: Prisma.MatchWhereInput = {};

  // Fetch by tournamentId
  whereCondition.OR = [{ tournamentId }];

  if (options?.searchTerm) {
    const searchTerm = options.searchTerm;
    const weekNumber = parseInt(searchTerm, 10);

    whereCondition.OR = [
      { // Search by local team name
        local: { name: { contains: searchTerm, mode: 'insensitive' } },
      },
      { // Search by visitor team name
        visitor: { name: { contains: searchTerm, mode: 'insensitive' } },
      },
    ];

    // If the search term is a valid number, add the condition to search by week.
    if (!isNaN(weekNumber)) {
      whereCondition.OR.push({
        week: { equals: weekNumber },
      });
    }

    // Search by status in Spanish
    const searchTermLower = searchTerm.toLowerCase();
    const status = statusMap[searchTermLower];
    if (status) {
      whereCondition.OR.push({ status: { equals: status } });
    }
  }

  try {
    const matches = await prisma.match.findMany({
      where: whereCondition,
      orderBy: [
        { matchDate: sortMatchDate },
        { week: sortWeek ?? 'desc' },
      ],
      take: take,
      skip: (page - 1) * take,
      select: {
        id: true,
        local: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
        visitor: {
          select: {
            id: true,
            name: true,
            permalink: true,
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

    const totalCount = await prisma.match.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matches: matches.map((match) => ({
        id: match.id,
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
        currentPage: page,
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
          currentPage: 0,
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
        currentPage: 0,
        totalPages: 0,
      },
    };
  }
};
