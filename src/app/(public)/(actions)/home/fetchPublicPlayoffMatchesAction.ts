'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

type Options = Readonly<{
  nextMatches?: number;
  selectedDay?: string;
  take?: number;
  timeZone?: string;
}>;

export type MatchResponse = {
  id: string;
  localScore: number;
  visitorScore: number;
  status: MATCH_STATUS_TYPE;
  place: string | null;
  matchDate: Date | null;
  round: string;
  group: string;
  playoffId: string;
  category: {
    id: string;
    name: string;
    permalink: string;
  } | null;
  tournament: {
    name: string;
    permalink: string;
  },
  localTeam: {
    id: string;
    name: string;
    permalink: string;
    imageUrl: string | null,
  };
  visitorTeam: {
    id: string;
    name: string;
    permalink: string;
    imageUrl: string | null,
  };
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

export const fetchPublicPlayoffMatchesAction = async (options?: Options): ResponseFetchAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-playoff-matches');

  let { nextMatches = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(nextMatches)) nextMatches = 1;
  if (isNaN(take)) take = 12;

  try {
    const matches = await prisma.playoffMatch.findMany({
      where: {
        OR: [
          { status: 'scheduled' },
          { status: 'completed' },
          { status: 'canceled' },
        ],
      },
      orderBy: { matchDate: 'desc' },
      take,
      skip: (nextMatches - 1) * take,
      select: {
        id: true,
        localScore: true,
        visitorScore: true,
        status: true,
        matchDate: true,
        round: true,
        group: true,
        field: {
          select: {
            name: true,
          },
        },
        playoff: {
          select: {
            id: true,
            category: {
              select: {
                id: true,
                name: true,
                permalink: true,
              },
            },
            tournament: {
              select: {
                name: true,
                permalink: true,
              },
            },
          },
        },
        local: {
          select: {
            id: true,
            name: true,
            permalink: true,
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
      },
    });

    const totalCount = await prisma.playoffMatch.count({
      orderBy: { matchDate: 'desc' },
      take: 100,
    });

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      matches: matches.map((match) => ({
        id: match.id,
        localScore: match.localScore ?? 0,
        visitorScore: match.visitorScore ?? 0,
        status: match.status,
        place: match.field?.name ?? null,
        matchDate: match.matchDate,
        round: match.round,
        group: match.group,
        playoffId: match.playoff.id,
        category: match.playoff.category,
        tournament: match.playoff.tournament,
        localTeam: match.local,
        visitorTeam: match.visitor,
        penaltyShoots: match.penaltyShootout,
      })),
      pagination: {
        nextMatches,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los encuentros de liguilla');
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
      message: 'Error inesperado al obtener los encuentros de liguilla, revise los logs del servidor',
      matches: [],
      pagination: {
        nextMatches: 0,
        totalPages: 0,
      },
    };
  }
};
