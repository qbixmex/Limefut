'use server';

import prisma from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import type { Pagination } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type Options = Readonly<{
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  tournaments: TOURNAMENT_TYPE[];
  pagination: Pagination | null;
}>;

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string | null;
  imageUrl: string | null;
  season: string | null;
  startDate: Date;
  endDate: Date;
  active: boolean;
  categoriesQuantity: number;
};

export const fetchTournamentsAction = async (options?: Options): ResponseFetch => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-tournaments');

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
    const tournamentSelect = {
      id: true,
      name: true,
      permalink: true,
      imageUrl: true,
      season: true,
      active: true,
      startDate: true,
      endDate: true,
      _count: {
        select: {
          categories: true,
        },
      },
    } satisfies Prisma.TournamentSelect;

    const tournaments = await prisma.tournament.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      select: tournamentSelect,
      take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.tournament.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Los torneos fueron obtenidos correctamente 👍',
      tournaments: tournaments.map((tournament) => ({
        ...tournament,
        categoriesQuantity: tournament._count?.categories ?? 0,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los torneos');
      return {
        ok: false,
        message: error.message,
        tournaments: [],
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener los torneos, revise los logs del servidor',
      tournaments: [],
      pagination: null,
    };
  }
};
