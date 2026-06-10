'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { type PLAYOFF_ROUND_TYPE, type MATCH_STATUS_TYPE, MATCH_STATUS } from '@/shared/enums';
import type { Pagination } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  matches: PLAYOFF_MATCH[];
  pagination: Pagination;
}>;

export type PLAYOFFS_TYPE = {
  id: string;
  teamIds: string[];
  startingRound: string;
};

export type PLAYOFF_MATCH = {
  id: string;
  status: MATCH_STATUS_TYPE;
  visitor: TEAM_TYPE;
  local: TEAM_TYPE;
  round: PLAYOFF_ROUND_TYPE;
  group: string;
  position: number;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: Date | null;
  field: FIELD_TYPE | null;
  penaltyShootout: PENALTY_SHOOTOUT_TYPE | null;
};

export type FIELD_TYPE = {
  id: string;
  name: string;
};

export type TEAM_TYPE = {
  id: string;
  name: string;
};

export type PENALTY_SHOOTOUT_TYPE = {
  id: string;
  status: string;
  localGoals: number;
  visitorGoals: number;
  winnerTeamId: string | null;
};

export const fetchPlayoffMatchesAction = async ({
  playoffId,
  sortMatchDate,
  status,
  searchTerm,
  page = 1,
  take = 12,
} : {
  playoffId: string;
  searchTerm?: string;
  page?: number;
  take?: number;
  sortMatchDate?: 'asc' | 'desc';
  status?: MATCH_STATUS_TYPE;
}): ResponseFetchAction => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-playoff-matches');

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const STATUS_MAP: Record<string, MATCH_STATUS_TYPE> = {
    programado: MATCH_STATUS.SCHEDULED,
    'en revision': MATCH_STATUS.IN_REVIEW,
    'en progreso': MATCH_STATUS.IN_PROGRESS,
    finalizado: MATCH_STATUS.COMPLETED,
    pospuesto: MATCH_STATUS.POST_POSED,
    cancelado: MATCH_STATUS.CANCELED,
  };

  const wherePlayoffMatchCondition: Prisma.PlayoffMatchWhereInput = {
    status,
  };

  // SEARCH QUERY PARAMS
  if (searchTerm) {
    if (searchTerm.includes('vs')) {
      const segments = searchTerm.split('vs');
      const localTeam = segments[0].trim().toLowerCase();
      const visitorTeam = segments[1].trim().toLowerCase();

      wherePlayoffMatchCondition.AND = [
        {
          local: {
            is: { name: { contains: localTeam, mode: 'insensitive' } },
          },
        },
        {
          visitor: {
            is: { name: { contains: visitorTeam, mode: 'insensitive' } },
          },
        },
      ];
    } else {
      wherePlayoffMatchCondition.OR = [
        { // Search by local team name
          local: { name: { contains: searchTerm, mode: 'insensitive' } },
        },
        { // Search by visitor team name
          visitor: { name: { contains: searchTerm, mode: 'insensitive' } },
        },
      ];

      // Search by status in Spanish
      const searchTermLower = searchTerm.toLowerCase();
      const status = STATUS_MAP[searchTermLower];

      if (status) {
        wherePlayoffMatchCondition.OR.push({ status: { equals: status } });
      }
    }
  }

  try {
    const playoffs = await prisma.playoff.findFirst({
      where: { id: playoffId },
      select: { id: true },
    });

    if (!playoffs) {
      return {
        ok: false,
        message: '¡ No se pudo encontrar la liguilla con el id subministrado !',
        matches: [],
        pagination: {
          currentPage: 0,
          totalPages: 0,
        },
      };
    }

    const matches = await prisma.playoffMatch.findMany({
      where: {
        playoffId: playoffs.id,
        ...wherePlayoffMatchCondition,
      },
      orderBy: { matchDate: sortMatchDate },
      select: {
        id: true,
        round: true,
        group: true,
        position: true,
        local: {
          select: {
            id: true,
            name: true,
          },
        },
        localScore: true,
        visitor: {
          select: {
            id: true,
            name: true,
          },
        },
        visitorScore: true,
        status: true,
        matchDate: true,
        field: {
          select: {
            id: true,
            name: true,
          },
        },
        penaltyShootout: {
          select: {
            id: true,
            status: true,
            localGoals: true,
            visitorGoals: true,
            winnerTeamId: true,
          },
        },
      },
    });

    const totalCount = await prisma.playoffMatch.count({ where: wherePlayoffMatchCondition });

    return {
      ok: true,
      message: '! Los encuentros de liguilla fueron obtenidos correctamente 👍',
      matches,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los encuentros');
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
      message: 'Error inesperado al obtener los encuentros, revise los logs del servidor',
      matches: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }
};
