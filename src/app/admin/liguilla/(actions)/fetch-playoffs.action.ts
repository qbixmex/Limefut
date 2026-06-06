'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';
import type { Pagination } from '@/shared/interfaces';

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  playoffs: PLAYOFFS_TYPE[];
  pagination: Pagination;
}>;

export type PLAYOFFS_TYPE = {
  id: string;
  teamsCount: number;
  startingRound: string;
  tournament: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  } | null;
};

export const fetchPlayoffsAction = async ({
  authenticatedUserId,
  authenticatedUserRoles,
  page = 1,
  take = 12,
  query: searchTerm,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  page?: number;
  take?: number;
  query?: string;
}): ResponseFetchAction => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-playoffs');

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autentificado !',
      playoffs: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos para realizar esta acción !',
      playoffs: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.PlayoffWhereInput = {};

  // SEARCH QUERY PARAMS
  if (searchTerm) {
    // Search by status in Spanish
    const searchTermSanitized = searchTerm.trim().toLowerCase();

    whereCondition.OR = [
      {
        tournament: {
          name: {
            contains: searchTermSanitized,
            mode: 'insensitive',
          },
        },
      },
      {
        category: {
          name: {
            contains: searchTermSanitized,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  try {
    const playoffs = await prisma.playoff.findMany({
      where: whereCondition,
      select: {
        id: true,
        startingRound: true,
        teamIds: true,
        tournament: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take,
      skip: (page - 1) * take,
    });

    if (!playoffs) {
      return {
        ok: false,
        message: '¡ No se pudo obtener las post temporadas ❌ !',
        playoffs: [],
        pagination: {
          currentPage: 0,
          totalPages: 0,
        },
      };
    }

    const totalCount = await prisma.playoff.count({ where: whereCondition });

    return {
      ok: true,
      message: 'Las post temporadas fueron obtenidas correctamente 👍',
      playoffs: playoffs.map((playoff) => ({
        id: playoff.id,
        startingRound: playoff.startingRound,
        tournament: playoff.tournament,
        category: playoff.category,
        teamsCount: playoff.teamIds.length,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('¡ Error al intentar obtener las post temporadas ❌ !');
      return {
        ok: false,
        message: error.message,
        playoffs: [],
        pagination: {
          currentPage: 0,
          totalPages: 0,
        },
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado al obtener los encuentros, revise los logs del servidor ❌ !',
      playoffs: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }
};
