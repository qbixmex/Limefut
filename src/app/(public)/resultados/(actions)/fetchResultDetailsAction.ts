'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type MatchType = {
  id: string;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: Date | null;
  week: number | null;
  status: string;
  place: string | null;
  referee: string | null;
  tournament: {
    name: string;
    permalink: string;
    country: string | null;
    season: string | null;
  };
  category: {
    name: string;
    permalink: string;
  } | null;
  local: TEAM_TYPE;
  visitor: TEAM_TYPE;
  penaltyShootout: {
    id: string;
    status: string;
    localGoals: number;
    visitorGoals: number;
    winnerTeamId: string | null;
    localTeam: {
      name: string;
      id: string;
      permalink: string;
    };
    visitorTeam: {
      name: string;
      id: string;
      permalink: string;
    };
    kicks: {
      id: string;
      teamId: string;
      playerId: string | null;
      shooterName: string | null;
      order: number;
      isGoal: boolean | null;
    }[];
  } | null | undefined;
};

type TEAM_TYPE = {
  name: string;
  permalink: string;
  imageUrl: string | null;
  format: string;
  category: CATEGORY_TYPE | null;
};

type CATEGORY_TYPE = {
  name: string;
  permalink: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  match: MatchType | null;
}>;

export const fetchResultDetailsAction = async (matchId: string): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-result-details');

  try {
    const matchSelect = {
      id: true,
      localScore: true,
      visitorScore: true,
      matchDate: true,
      week: true,
      status: true,
      place: true,
      referee: true,
      category: {
        select: {
          name: true,
          permalink: true,
        },
      },
      tournament: {
        select: {
          name: true,
          permalink: true,
          country: true,
          season: true,
        },
      },
      local: {
        select: {
          name: true,
          permalink: true,
          imageUrl: true,
          format: true,
          category: {
            select: {
              name: true,
              permalink: true,
            },
          },
        },
      },
      visitor: {
        select: {
          name: true,
          permalink: true,
          imageUrl: true,
          format: true,
          category: {
            select: {
              name: true,
              permalink: true,
            },
          },
        },
      },
      penaltyShootout: {
        select: {
          id: true,
          localTeam: {
            select: {
              id: true,
              name: true,
              permalink: true,
            },
          },
          visitorTeam: {
            select: {
              id: true,
              name: true,
              permalink: true,
            },
          },
          localGoals: true,
          visitorGoals: true,
          winnerTeamId: true,
          status: true,
          kicks: {
            select: {
              id: true,
              teamId: true,
              playerId: true,
              shooterName: true,
              order: true,
              isGoal: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      },
    } satisfies Prisma.MatchSelect;

    const match = await prisma.match.findUnique({
      where: {
        id: matchId,
      },
      select: matchSelect,
    });

    if (!match) {
      return {
        ok: false,
        message: `¡ El encuentro con el id: "${matchId}" no existe ❌ !`,
        match: null,
      };
    }

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      match,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los encuentros');
      return {
        ok: false,
        message: error.message,
        match: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener el encuentro, revise los logs del servidor',
      match: null,
    };
  }
};
