'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

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
    category: string | null;
    format: string | null;
    country: string | null;
    season: string | null;
  };
  local: {
    name: string;
    permalink: string;
    imageUrl: string | null;
    category: string;
    format: string;
  };
  visitor: {
    name: string;
    permalink: string;
    imageUrl: string | null;
    category: string;
    format: string;
  };
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

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  match: MatchType | null;
}>;

export const fetchResultDetailsAction = async (matchId: string): ResponseAction => {
  "use cache";

  cacheLife('days');
  cacheTag('public-result-details');

  try {
    const match = await prisma.match.findUnique({
      where: {
        id: matchId,
      },
      select: {
        id: true,
        localScore: true,
        visitorScore: true,
        matchDate: true,
        week: true,
        status: true,
        place: true,
        referee: true,
        tournament: {
          select: {
            name: true,
            permalink: true,
            category: true,
            format: true,
            country: true,
            season: true,
          },
        },
        local: {
          select: {
            name: true,
            permalink: true,
            imageUrl: true,
            category: true,
            format: true,
          },
        },
        visitor: {
          select: {
            name: true,
            permalink: true,
            imageUrl: true,
            category: true,
            format: true,
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
      },
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
      console.log("Error al intentar obtener los encuentros");
      return {
        ok: false,
        message: error.message,
        match: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener el encuentro, revise los logs del servidor",
      match: null,
    };
  }
};
