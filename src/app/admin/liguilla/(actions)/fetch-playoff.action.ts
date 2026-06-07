'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  playoff: PLAYOFF_TYPE | null;
}>;

export type PLAYOFF_TYPE = {
  id: string;
  startingRound: string;
  tournament: TOURNAMENT_TYPE;
  category: CATEGORY_TYPE | undefined;
  teams: TEAM_TYPE[];
};

type TOURNAMENT_TYPE = { id: string; name: string; };
type CATEGORY_TYPE = { name: string; };
type TEAM_TYPE = { id: string; name: string; };

export const fetchPlayoffAction = async (
  playoffId: string, {
    authenticatedUserId,
    authenticatedUserRoles,
  }: {
    authenticatedUserId: string | undefined;
    authenticatedUserRoles: string[] | null | undefined;
  },
): ResponseAction => {
  'use cache';

  cacheLife('max');
  cacheTag('admin-tournaments');

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
      playoff: null,
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos para realizar esta acción !',
      playoff: null,
    };
  }

  try {
    const playoff = await prisma.playoff.findFirst({
      where: { id: playoffId },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        teamIds: true,
        startingRound: true,
        tournament: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: { name: true },
        },
      },
    });

    if (!playoff) {
      return {
        ok: false,
        message: '¡ No se pudo obtener detalles de la liguilla !',
        playoff: null,
      };
    }

    const teams = await prisma.team.findMany({
      where: { id: { in: playoff?.teamIds } },
      select: { id: true, name: true },
    });

    const teamsMap = new Map(teams.map((team) => [team.id, team]));

    const orderedTeams = playoff.teamIds
      .map((id) => teamsMap.get(id))
      .filter((team): team is TEAM_TYPE => team !== undefined);

    return {
      ok: true,
      message: '! La liguilla fue obtenida correctamente 👍 !',
      playoff: {
        id: playoff.id,
        startingRound: playoff.startingRound,
        tournament: playoff.tournament,
        category: playoff.category ?? undefined,
        teams: orderedTeams,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('¡ Error al intentar obtener la liguilla');
      return {
        ok: false,
        message: error.message,
        playoff: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      playoff: null,
    };
  }
};
