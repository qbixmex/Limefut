'use server';

import prisma from '@/lib/prisma';
import type { Team } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  team: TEAM_TYPE;
}>;

export type TEAM_TYPE = Team & {
  tournament: {
    id: string;
    name: string;
    permalink: string;
  } | null;
  categories: CATEGORY_TYPE[];
  coach: COACH_TYPE | null;
  players: PLAYER_TYPE[] | null;
  fields: FIELD_TYPE[];
} | null;

type CATEGORY_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

type COACH_TYPE = {
  id: string;
  name: string;
};

type PLAYER_TYPE = {
  id: string;
  name: string;
};

type FIELD_TYPE = {
  id: string;
  name: string;
};

export const fetchTeamAction = async (
  teamId: string,
  userRole: string[] | null,
): FetchTeamResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-team');

  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      team: null,
    };
  }

  try {
    const team = await prisma.team.findFirst({
      where: { id: teamId },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
            permalink: true,
          },
        },
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                permalink: true,
              },
            },
          },
        },
        coach: {
          select: {
            id: true,
            name: true,
          },
        },
        players: {
          select: {
            id: true,
            name: true,
          },
        },
        fields: {
          select: {
            field: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      return {
        ok: false,
        message: `¡ El equipo con el ID: "${teamId}" no existe ❌ !`,
        team: null,
      };
    }

    return {
      ok: true,
      message: '¡ Equipo obtenido correctamente 👍 !',
      team: {
        ...team,
        categories: team.categories.map(tc => tc.category),
        fields: team.fields.map(tf => tf.field),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el equipo,\n¡ Revise los logs del servidor !',
        team: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      team: null,
    };
  }
};
