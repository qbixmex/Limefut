'use server';

import type { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import type { Pagination } from "@/shared/interfaces";

type Options = Readonly<{
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

export type ResponseFetchTournaments = Promise<{
  ok: boolean;
  message: string;
  tournaments: {
    id: string;
    name: string;
    permalink: string;
    imageUrl: string | null;
    season: string;
    startDate: Date;
    endDate: Date;
    active: boolean;
  }[] | null;
  pagination: Pagination | null;
}>;

export const fetchTournamentsAction = async (options?: Options): ResponseFetchTournaments => {
  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.TournamentWhereInput = options?.searchTerm ? {
    OR: [
      {
        name: {
          contains: options.searchTerm,
          mode: 'insensitive' as const,
        },
      },
      {
        season: {
          contains: options.searchTerm,
          mode: 'insensitive' as const,
        },
      },
    ],
  } : {};

  try {
    const tournaments = await prisma.tournament.findMany({
      where: whereCondition,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        season: true,
        startDate: true,
        endDate: true,
        active: true,
      },
      take: take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.tournament.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Los torneos fueron obtenidos correctamente 👍',
      tournaments: tournaments.map((tournament) => ({
        id: tournament.id,
        name: tournament.name,
        permalink: tournament.permalink,
        imageUrl: tournament.imageUrl,
        season: tournament.season,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        active: tournament.active,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los torneos");
      return {
        ok: false,
        message: error.message,
        tournaments: null,
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los torneos, revise los logs del servidor",
      tournaments: null,
      pagination: null,
    };
  }
};
