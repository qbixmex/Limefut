'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import type { PENALTY_SHOOTOUT_TYPE } from '@/shared/types/penalty_shootout_type';
import { cacheLife, cacheTag } from 'next/cache';

export type MATCH_TYPE = {
  id: string;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: Date | null;
  referee: string | null;
  status: MATCH_STATUS_TYPE;
  group: string;
  round: string;
  remarks: string | null;
  localTeam: {
    id: string;
    name: string;
    players: {
      id: string;
      name: string;
    }[];
  };
  visitorTeam: {
        id: string;
        name: string;
        players: {
            id: string;
            name: string;
        }[];
    };
  fieldId: string | null;
  penaltyShootout: PENALTY_SHOOTOUT_TYPE | null;
};

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  match: MATCH_TYPE | null,
}>;

export const fetchMatchForEditAction = async ({
  playoffId,
  matchId,
}: {
  playoffId: string,
  matchId: string,
}): FetchResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-playoff-match');

  try {
    const playoffMatch = await prisma.playoffMatch.findFirst({
      where: { id: matchId, playoffId },
      select: {
        id: true,
        matchDate: true,
        referee: true,
        localScore: true,
        visitorScore: true,
        status: true,
        group: true,
        round: true,
        remarks: true,
        local: {
          select: {
            id: true,
            name: true,
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
            players: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        fieldId: true,
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
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!playoffMatch) {
      return {
        ok: false,
        message: `¡ El encuentro no existe con el id [${matchId}] ❌ !`,
        match: null,
      };
    }

    return {
      ok: true,
      message: '¡ Encuentro obtenido correctamente 👍 !',
      match: {
        id: playoffMatch.id,
        matchDate: playoffMatch.matchDate,
        referee: playoffMatch.referee,
        localScore: playoffMatch.localScore,
        visitorScore: playoffMatch.visitorScore,
        status: playoffMatch.status,
        group: playoffMatch.group,
        round: playoffMatch.round,
        remarks: playoffMatch.remarks,
        localTeam: playoffMatch.local,
        visitorTeam: playoffMatch.visitor,
        fieldId: playoffMatch.fieldId,
        penaltyShootout: playoffMatch.penaltyShootout,
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
