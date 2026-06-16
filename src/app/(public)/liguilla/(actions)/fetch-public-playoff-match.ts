'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import type { MATCH_STATUS_TYPE, PLAYOFF_ROUND_TYPE } from '@/shared/enums';
import type { PENALTY_SHOOTOUT_TYPE } from '@/shared/types/penalty_shootout_type';

type Options = {
  tournamentPermalink: string | undefined;
  categoryPermalink: string | undefined;
  localTeamPermalink: string | undefined;
  visitorTeamPermalink: string | undefined;
};

type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  match: Match | null;
}>;

export type Match = {
  id: string;
  round: PLAYOFF_ROUND_TYPE;
  group: string;
  localScore: number | null;
  visitorScore: number | null;
  status: MATCH_STATUS_TYPE;
  matchDate: Date | null;
  referee: string | null;
  remarks: string | null;
  tournament: {
    name: string;
    permalink: string;
  };
  category: {
    name: string;
    permalink: string;
  } | null;
  local: {
    name: string;
    permalink: string;
    imageUrl: string | null;
  };
  visitor: {
    name: string;
    permalink: string;
    imageUrl: string | null;
  };
  winner: {
    name: string;
    permalink: string;
  } | null;
  field: {
    name: string;
    permalink: string;
  } | null;
  penaltyShootout: PENALTY_SHOOTOUT_TYPE | null;
};

export const fetchPublicPlayoffMatchAction = async (options: Options): ResponseAction => {
  'use cache';

  cacheLife('days');
  cacheTag('public-playoff-match');

  const {
    tournamentPermalink,
    categoryPermalink,
    localTeamPermalink,
    visitorTeamPermalink,
  } = options;

  try {
    const playoff = await prisma.playoff.findFirst({
      where: {
        tournament: {
          permalink: tournamentPermalink,
        },
        category: {
          permalink: categoryPermalink,
        },
      },
      select: {
        id: true,
        tournament: {
          select: {
            name: true,
            permalink: true,
          },
        },
        category: {
          select: {
            name: true,
            permalink: true,
          },
        },
      },
    });

    if (!playoff) {
      return {
        ok: false,
        message: '! No se encentró el la liguilla con el torneo y categoría subministrados ¡',
        match: null,
      };
    }

    const playoffMatch = await prisma.playoffMatch.findFirst({
      where: {
        playoff: { id: playoff.id },
        local: { permalink: localTeamPermalink },
        visitor: { permalink: visitorTeamPermalink },
      },
      select: {
        id: true,
        round: true,
        group: true,
        localScore: true,
        visitorScore: true,
        status: true,
        matchDate: true,
        referee: true,
        remarks: true,
        local: {
          select: {
            name: true,
            permalink: true,
            imageUrl: true,
          },
        },
        visitor: {
          select: {
            name: true,
            permalink: true,
            imageUrl: true,
          },
        },
        winner: {
          select: {
            name: true,
            permalink: true,
          },
        },
        field: {
          select: {
            name: true,
            permalink: true,
          },
        },
        penaltyShootout: {
          select: {
            id: true,
            localTeam: {
              select: {
                id: true,
                name: true,
              },
            },
            visitorTeam: {
              select: {
                id: true,
                name: true,
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
            },
          },
        },
      },
    });

    if (!playoffMatch) {
      return {
        ok: false,
        message: '! No se encentró el encuentro de liguilla con el torneo y categoría subministrados ¡',
        match: null,
      };
    }

    return {
      ok: true,
      message: '¡ Encuentro de liguilla obtenido correctamente 👍 !',
      match: {
        ...playoffMatch,
        tournament: playoff.tournament,
        category: playoff.category,
      },
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.log(error.message);
      return {
        ok: false,
        message: error.message,
        match: null,
      };
    }

    if (error instanceof Error) {
      console.log('ERROR:', error);
      return {
        ok: false,
        message: '! Unknown Error, check server logs for more details !',
        match: null,
      };
    }

    console.log(`ERROR: ${error as Error}`);

    return {
      ok: false,
      message: '! Unknown Error, check server logs for more details !',
      match: null,
    };
  }
};
