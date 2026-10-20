'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { MATCH_STATUS, type MATCH_MODE_TYPE, type MATCH_STATUS_TYPE } from '@/shared/enums';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { cacheLife, cacheTag } from 'next/cache';

type Options = Readonly<{
  nextMatches?: number;
  selectedDay?: string;
  take?: number;
  timeZone?: string;
}>;

export type MatchResponse = {
  id: string;
  tournament: {
    name: string;
    permalink: string;
  },
  localTeam: {
    name: string;
    id: string;
    permalink: string;
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
  status: MATCH_STATUS_TYPE;
  mode: MATCH_MODE_TYPE;
  week: number | null;
  field: {
    id: string;
    name: string;
  } | null;
  matchDate: Date | null;
  category: {
    id: string;
    name: string;
    permalink: string;
  } | null;
  penaltyShoots: {
    localGoals: number;
    visitorGoals: number;
  } | null;
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
  'use cache';

  cacheLife('hours');
  cacheTag('matches');

  let { nextMatches = 1, take = 12 } = options ?? {};
  const selectedDay = options?.selectedDay;
  const timeZone = options?.timeZone ?? 'America/Mexico_City';

  let startOfDate: Date;
  let endOfDate: Date;

  if (selectedDay) {
    startOfDate = fromZonedTime(`${selectedDay}T00:00:00.000`, timeZone);
    endOfDate = fromZonedTime(`${selectedDay}T23:59:59.999`, timeZone);
  } else {
    const nowInZone = toZonedTime(new Date(), timeZone);

    const startInZone = new Date(nowInZone);
    startInZone.setHours(0, 0, 0, 0);
    startOfDate = fromZonedTime(startInZone, timeZone);

    const endInZone = new Date(nowInZone);
    endInZone.setHours(23, 59, 59, 999);
    endOfDate = fromZonedTime(endInZone, timeZone);
  }

  // In case is an invalid number like (lorem)
  if (isNaN(nextMatches)) nextMatches = 1;
  if (isNaN(take)) take = 12;

  try {
    const matchSelect = {
      id: true,
      tournament: {
        select: {
          name: true,
          permalink: true,
        },
      },
      local: {
        select: {
          id: true,
          name: true,
          permalink: true,
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
      penaltyShootout: {
        select: {
          localGoals: true,
          visitorGoals: true,
        },
      },
      localScore: true,
      visitorScore: true,
      status: true,
      mode: true,
      week: true,
      field: {
        select: {
          id: true,
          name: true,
        },
      },
      matchDate: true,
      category: {
        select: {
          id: true,
          name: true,
          permalink: true,
        },
      },
    } satisfies Prisma.MatchSelect;

    const where = {
      status: {
        in: [
          MATCH_STATUS.IN_PROGRESS,
          MATCH_STATUS.SCHEDULED,
          MATCH_STATUS.COMPLETED,
          MATCH_STATUS.CANCELED,
        ],
      },
      matchDate: {
        gte: startOfDate,
        lte: endOfDate,
      },
    } satisfies Prisma.MatchWhereInput;

    const totalCount = await prisma.match.count({ where });
    const totalPages = Math.ceil(totalCount / take);
    const currentPage = totalPages > 0
      ? Math.min(Math.max(nextMatches, 1), totalPages)
      : 1;

    const data = await prisma.match.findMany({
      where,
      orderBy: { matchDate: 'asc' },
      take,
      skip: (currentPage - 1) * take,
      select: matchSelect,
    });

    return {
      ok: true,
      message: 'Los encuentros fueron obtenidos correctamente',
      matches: (data.length > 0) ? data.map((match) => ({
        ...match,
        localTeam: match.local,
        visitorTeam: match.visitor,
        localScore: match.localScore ?? 0,
        visitorScore: match.visitorScore ?? 0,
        penaltyShoots: match.penaltyShootout,
      })) : [],
      pagination: {
        nextMatches: currentPage,
        totalPages,
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
          nextMatches: 0,
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
        nextMatches: 0,
        totalPages: 0,
      },
    };
  }
};
