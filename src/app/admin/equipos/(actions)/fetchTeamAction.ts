'use server';

import prisma from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import type { GENDER_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  team: TEAM_TYPE;
}>;

export type TEAM_TYPE = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  categoryName: string | null;
  format: string;
  gender: GENDER_TYPE;
  country: string | null;
  city: string | null;
  state: string | null;
  emails: string[];
  address: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  tournament: {
    id: string;
    name: string;
    permalink: string;
  } | null;
  category: CATEGORY_TYPE | null;
  coach: COACH_TYPE | null;
  players: PLAYER_TYPE[] | null;
  fields: FIELD_TYPE[];
} | null;

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
    const teamSelect = {
      id: true,
      name: true,
      permalink: true,
      imageUrl: true,
      imagePublicID: true,
      categoryName: true,
      format: true,
      gender: true,
      country: true,
      city: true,
      state: true,
      emails: true,
      address: true,
      active: true,
      createdAt: true,
      updatedAt: true,
      tournament: {
        select: {
          id: true,
          name: true,
          permalink: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          permalink: true,
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
    } satisfies Prisma.TeamSelect;

    const team = await prisma.team.findFirst({
      where: { id: teamId },
      select: teamSelect,
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
