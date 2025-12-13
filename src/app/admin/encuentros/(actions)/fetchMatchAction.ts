'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS } from '@/root/src/shared/enums';
import type { Match } from '@/shared/interfaces';

export type TournamentType = {
  id: string;
  name: string;
};

export type PenaltyShoot = {
  id: string;
  isGoal: boolean | null;
  shooterName: string | null;
  team: { id: string };
};

export type MatchType = Match & {
  tournament: TournamentType;
  penaltiesShoots: PenaltyShoot[];
  localPenalties: number;
  visitorPenalties: number;
};

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  match: MatchType | null,
}>;

const getPenaltyScores = (
  shoots: Partial<PenaltyShoot>[],
  localTeamId: string,
  visitorTeamId: string,
) => {
  let localPenalties = 0;
  let visitorPenalties = 0;

  shoots.forEach((shoot) => {
    if (shoot.isGoal) {
      if (shoot.team?.id === localTeamId) {
        localPenalties++;
      }
      if (shoot.team?.id === visitorTeamId) {
        visitorPenalties++;
      }
    }
  });

  return {
    localPenalties,
    visitorPenalties,
  };
};

export const fetchMatchAction = async (
  id: string,
  userRole: string[] | null,
): FetchResponse => {
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
        local: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
        visitor: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
        place: true,
        matchDate: true,
        week: true,
        referee: true,
        localScore: true,
        visitorScore: true,
        status: true,
        tournament: {
          select: {
            id: true,
            name: true,
          },
        },
        penaltiesShoots: {
          select: {
            id: true,
            shooterName: true,
            isGoal: true,
            team: {
              select: {
                id: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!match) {
      return {
        ok: false,
        message: '¡ Encuentro no encontrado ❌ !',
        match: null,
      };
    }

    const { localPenalties, visitorPenalties } = getPenaltyScores(
      match.penaltiesShoots,
      match.local.id,
      match.visitor.id,
    );

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
        localScore: match.localScore ?? 0,
        visitorScore: match.visitorScore ?? 0,
        status: match.status as MATCH_STATUS,
        tournament: {
          id: match.tournament.id,
          name: match.tournament.name,
        },
        penaltiesShoots: match.penaltiesShoots,
        localPenalties,
        visitorPenalties,
        createdAt: match.createdAt,
        updatedAt: match.updatedAt,
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
