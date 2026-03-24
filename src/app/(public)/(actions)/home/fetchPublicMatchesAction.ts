'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from '@/shared/enums';
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
  status: MATCH_STATUS_TYPE;
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
  'use cache';

  cacheLife('days');
  cacheTag('matches');

  let { nextMatches = 1, take = 12 } = options ?? {};
  const selectedDay = options?.selectedDay;
  const timeZone = options?.timeZone ?? 'UTC';

  const now = new Date();
  const nowInTimeZone = toZonedTime(now, timeZone);
  const today = fromZonedTime(nowInTimeZone, timeZone);
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const diffToEndOfWeek = (7 - dayOfWeek) % 7;

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + diffToEndOfWeek);
  endOfWeek.setHours(23, 59, 59, 999);

  let dateFilter: Record<string, Date>;
  let isPastDate = false;

  if (selectedDay) {
    const midnightInClientZone = new Date(selectedDay + 'T00:00:00');
    if (isNaN(midnightInClientZone.getTime())) {
      dateFilter = { gte: today, lte: endOfWeek };
    } else {
      const selectedDateInZone = toZonedTime(midnightInClientZone, timeZone);
      isPastDate = selectedDateInZone < today;

      const startOfDayUTC = fromZonedTime(new Date(selectedDay + 'T00:00:00'), timeZone);

      const endOfDayUTC = fromZonedTime(new Date(selectedDay + 'T00:00:00'), timeZone);
      endOfDayUTC.setHours(23, 59, 59, 999);

      dateFilter = { gte: startOfDayUTC, lte: endOfDayUTC };
    }
  } else {
    dateFilter = { gte: today, lte: endOfWeek };
  }

  const statusFilter: Prisma.MatchWhereInput['OR'] = isPastDate
    ? undefined
    : [
        { status: MATCH_STATUS.SCHEDULED },
        { status: MATCH_STATUS.IN_PROGRESS },
        { status: MATCH_STATUS.POST_POSED },
      ];

  // In case is an invalid number like (lorem)
  if (isNaN(nextMatches)) nextMatches = 1;
  if (isNaN(take)) take = 12;

  try {
    const data = await prisma.match.findMany({
      where: {
        ...(statusFilter && { OR: statusFilter }),
        matchDate: dateFilter,
      },
      orderBy: { matchDate: 'asc' },
      take,
      skip: (nextMatches - 1) * take,
      select: {
        id: true,
        tournament: {
          select: {
            name: true,
            permalink: true,
            currentWeek: true,
            state: true,
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
      where: {
        ...(statusFilter && { OR: statusFilter }),
        matchDate: dateFilter,
      },
    });

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matches: (data.length > 0) ? data.map((match) => ({
        id: match.id,
        tournament: match.tournament,
        localTeam: match.local,
        visitorTeam: match.visitor,
        localScore: match.localScore ?? 0,
        visitorScore: match.visitorScore ?? 0,
        status: match.status as MATCH_STATUS_TYPE,
        week: match.week,
        place: match.place,
        matchDate: match.matchDate,
      })) : [],
      pagination: {
        nextMatches,
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

export default fetchPublicMatchesAction;
