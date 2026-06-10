'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS_TYPE, ROUND_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  match: MATCH_TYPE | null;
}>;

export type MATCH_TYPE = {
  id: string;
  round: ROUND_TYPE;
  group: string;
  localScore: number | null;
  visitorScore: number | null;
  status: MATCH_STATUS_TYPE;
  matchDate: Date | null;
  referee: string | null;
  remarks: string | null;
  local: TEAM_TYPE;
  visitor: TEAM_TYPE;
  field: FIELD_TYPE | null;
  createdAt: Date;
  updatedAt: Date;
};

type TEAM_TYPE = { id: string; name: string; };
type FIELD_TYPE = { id: string; name: string; };

export const fetchPlayoffMatchAction = async ({
  authenticatedUserId,
  authenticatedUserRoles,
  playoffId,
  matchId,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  playoffId: string;
  matchId: string;
}): ResponseFetchAction => {
  'use cache';

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción  ❌ !',
      match: null,
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción  ❌ !',
      match: null,
    };
  }

  cacheLife('days');
  cacheTag('admin-playoff-match');

  try {
    const match = await prisma.playoffMatch.findFirst({
      where: { id: matchId, playoffId },
      select: {
        id: true,
        round: true,
        group: true,
        localScore: true,
        visitorScore: true,
        status: true,
        matchDate: true,
        referee: true,
        remarks: true,
        local: {
          select: {
            id: true,
            name: true,
          },
        },
        visitor: {
          select: {
            id: true,
            name: true,
          },
        },
        field: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ok: true,
      message: '! Las canchas fueron obtenidas correctamente 👍',
      match,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los encuentros');
      return {
        ok: false,
        message: error.message,
        match: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener las canchas, revise los logs del servidor',
      match: null,
    };
  }
};
