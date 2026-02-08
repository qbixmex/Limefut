'use server';

import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import type { Coach, Pagination } from "@/shared/interfaces";
import { cacheLife, cacheTag } from "next/cache";

type Options = Readonly<{
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

export type TeamType = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null,
  category: string | null;
  format: string | null;
  gender: string | null;
  active: boolean;
  coach: Pick<Coach, 'id' | 'name'> | null;
  playersCount: number;
};

export type ResponseFetchTeams = Promise<{
  ok: boolean;
  message: string;
  teams: TeamType[];
  pagination: Pagination;
}>;

export const fetchTeamsAction = async (
  tournamentId: string,
  options?: Options,
): ResponseFetchTeams => {
  "use cache";

  cacheLife('days');
  cacheTag('admin-teams');

  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.TeamWhereInput = {
    tournamentId: tournamentId !== 'none' ? tournamentId : null,
  };

  if (options?.searchTerm) {
    whereCondition.OR = [
      {
        name: {
          contains: options.searchTerm,
          mode: 'insensitive' as const,
        },
      },
    ];
  }

  try {
    const teams = await prisma.team.findMany({
      where: whereCondition,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        category: true,
        format: true,
        gender: true,
        active: true,
        coach: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { players: true },
        },
      },
      take: take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.team.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Los equipos fueron obtenidos correctamente 👍',
      teams: teams.map((team) => ({
        ...team,
        playersCount: team._count.players,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los equipos");
      return {
        ok: false,
        message: error.message,
        teams: [],
        pagination: {
          currentPage: 0,
          totalPages: 0,
        },
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los equipos, revise los logs del servidor",
      teams: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }
};
