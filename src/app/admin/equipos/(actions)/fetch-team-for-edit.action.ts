'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import type { GENDER_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  team: TEAM_TYPE | null,
}>;

export type TEAM_TYPE = {
  id: string;
  name: string;
  permalink: string;
  format: string;
  gender: GENDER_TYPE;
  country: string | null;
  city: string | null;
  state: string | null;
  emails: string[];
  address: string | null;
  active: boolean;
  coachId: string | null;
  tournament: TOURNAMENT_TYPE | null;
  category: CATEGORY_TYPE | null;
  fieldsIds: string[];
};

type TOURNAMENT_TYPE = {
  id: string;
  permalink: string;
};

type CATEGORY_TYPE = {
  id: string;
  permalink: string;
};

export const fetchTeamForEditAction = async ({
  teamId,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  teamId: string,
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}): FetchResponse => {
  'use cache';

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
      team: null,
    };
  }

  if ((!authenticatedUserRoles?.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      team: null,
    };
  }

  cacheLife('days');
  cacheTag('admin-team');

  try {
    const teamSelect = {
      id: true,
      name: true,
      permalink: true,
      format: true,
      gender: true,
      country: true,
      state: true,
      city: true,
      coachId: true,
      emails: true,
      address: true,
      fields: true,
      active: true,
      tournament: {
        select: {
          id: true,
          permalink: true,
        },
      },
      category: {
        select: {
          id: true,
          permalink: true,
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
        message: '¡ El equipo no existe con el id subministrado ❌ !',
        team: null,
      };
    }

    return {
      ok: true,
      message: '¡ El equipo fue obtenido correctamente 👍 !',
      team: {
        ...team,
        fieldsIds: team.fields.map(tf => tf.fieldId),
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
