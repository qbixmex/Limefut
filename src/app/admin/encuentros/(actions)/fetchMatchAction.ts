'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

export type MatchType = {
  id: string;
  place: string | null;
  matchDate: Date | null;
  week: number | null;
  referee: string | null;
  localScore: number;
  visitorScore: number;
  status: MATCH_STATUS_TYPE;
  createdAt: Date;
  localTeam: {
    name: string;
    id: string;
    permalink: string;
    players: {
      name: string;
      id: string;
    }[];
  }
  visitorTeam: {
    name: string;
    id: string;
    permalink: string;
    players: {
      name: string;
      id: string;
    }[];
  }
  tournament: TournamentType;
  penaltyShootout: {
    id: string;
    localTeam: {
      id: string;
      name: string;
      permalink: string;
    };
    visitorTeam: {
      id: string;
      name: string;
      permalink: string;
    };
    localGoals: number;
    visitorGoals: number;
    winnerTeamId: string | null;
    status: string;
    kicks: {
      id: string;
      teamId: string;
      playerId: string | null;
      shooterName: string | null;
      order: number;
      isGoal: boolean | null;
    }[];
  } | null;
};

export type TournamentType = {
  id: string;
  name: string;
  category: string;
  format: string;
};

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  match: MatchType | null,
}>;

export const fetchMatchAction = async (
  id: string,
  userRole: string[] | null,
): FetchResponse => {
  "use cache";

  cacheLife("days");
  cacheTag("admin-teams-for-match");

  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      match: null,
    };
  }

  try {
    const match = await prisma.match.findUnique({
      where: { id },
      select: {
        id: true,
        place: true,
        matchDate: true,
        week: true,
        referee: true,
        localScore: true,
        visitorScore: true,
        status: true,
        createdAt: true,
        local: {
          select: {
            id: true,
            name: true,
            permalink: true,
            players: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        visitor: {
          select: {
            id: true,
            name: true,
            permalink: true,
            players: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tournament: {
          select: {
            id: true,
            name: true,
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
        message: '¡ Encuentro no encontrado ❌ !',
        match: null,
      };
    }

    return {
      ok: true,
      message: '¡ Encuentro obtenido correctamente 👍 !',
      match: {
        id: match.id,
        localTeam: match.local,
        visitorTeam: match.visitor,
        place: match.place,
        matchDate: match.matchDate,
        week: match.week,
        referee: match.referee,
        createdAt: match.createdAt,
        localScore: match.localScore ?? 0,
        visitorScore: match.visitorScore ?? 0,
        status: match.status as MATCH_STATUS_TYPE,
        tournament: {
          id: match.tournament.id,
          name: match.tournament.name,
          category: match.tournament.category,
          format: match.tournament.format,
        },
        penaltyShootout: match.penaltyShootout,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener el encuentro,\n¡ Revise los logs del servidor !",
        match: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      match: null,
    };
  }
};
