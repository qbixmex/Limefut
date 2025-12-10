'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS } from '@/root/src/shared/enums';
import type { Match } from '@/shared/interfaces';

export type TournamentType = {
  id: string;
  name: string;
};

type FetchPlayerResponse = Promise<{
  ok: boolean;
  message: string;
  match: Match & {
    tournament: TournamentType;
  } | null;
}>;

export const fetchMatchAction = async (
  id: string,
  userRole: string[] | null,
): FetchPlayerResponse => {
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
