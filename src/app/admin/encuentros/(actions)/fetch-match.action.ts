'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

export type MATCH_TYPE = {
  id: string;
  place: string | null;
  matchDate: Date | null;
  week: number | null;
  referee: string | null;
  localScore: number;
  visitorScore: number;
  status: MATCH_STATUS_TYPE;
  createdAt: Date;
  localTeam: TEAM_TYPE
    & { players: PLAYER_TYPE[]; }
    & { fields: FIELD_TYPE[]; };
  visitorTeam: TEAM_TYPE
    & { players: PLAYER_TYPE[]; }
    & { fields: FIELD_TYPE[]; };
  tournament: TOURNAMENT_TYPE;
  category: CATEGORY_TYPE | null;
  penaltyShootout: PENALTY_SHOOTOUT_TYPE | null;
};

type TEAM_TYPE = {
  name: string;
  id: string;
  permalink: string;
};

type PLAYER_TYPE = {
  id: string;
  name: string;
};

type CATEGORY_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

type FIELD_TYPE = {
  id: string;
  name: string;
};

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export type PENALTY_SHOOTOUT_TYPE = {
  id: string;
  localTeam: TEAM_TYPE;
  visitorTeam: TEAM_TYPE & PLAYER_TYPE;
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
};

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  match: MATCH_TYPE | null,
}>;

export const fetchMatchAction = async (
  id: string,
  userRole: string[] | null,
): FetchResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-match');

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
            fields: {
              include: {
                field: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
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
            fields: {
              include: {
                field: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
        tournament: {
          select: {
            id: true,
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
        place: match.place,
        matchDate: match.matchDate,
        week: match.week,
        referee: match.referee,
        createdAt: match.createdAt,
        localScore: match.localScore ?? 0,
        visitorScore: match.visitorScore ?? 0,
        status: match.status as MATCH_STATUS_TYPE,
        localTeam: {
          ...match.local,
          fields: match.local.fields.map((teamField) => teamField.field),
        },
        visitorTeam: {
          ...match.visitor,
          fields: match.visitor.fields.map((teamField) => teamField.field),
        },
        tournament: {
          id: match.tournament.id,
          name: match.tournament.name,
          permalink: match.tournament.permalink,
        },
        category: match.category,
        penaltyShootout: match.penaltyShootout,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el encuentro,\n¡ Revise los logs del servidor !',
        match: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      match: null,
    };
  }
};
