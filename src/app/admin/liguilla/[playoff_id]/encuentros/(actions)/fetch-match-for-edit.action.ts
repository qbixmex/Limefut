'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS_TYPE, ROUND_TYPE } from '@/shared/enums';
import { cacheLife, cacheTag } from 'next/cache';

export type MATCH_TYPE = {
  id: string;
  round: ROUND_TYPE;
  group: string;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: Date | null;
  status: MATCH_STATUS_TYPE,
  referee: string | null;
  remarks: string | null;
  localId: string;
  visitorId: string;
  fieldId: string | null;
};

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  match: MATCH_TYPE | null,
}>;

export const fetchMatchForEditAction = async ({
  playoffId,
  matchId,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  playoffId: string,
  matchId: string,
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}): FetchResponse => {
  'use cache';

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
      match: null,
    };
  }

  if ((!authenticatedUserRoles?.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
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
        group: true,
        localScore: true,
        visitorScore: true,
        matchDate: true,
        status: true,
        referee: true,
        remarks: true,
        localId: true,
        visitorId: true,
        fieldId: true,
        round: true,
      },
    });

    if (!match) {
      return {
        ok: false,
        message: `¡ El encuentro no existe con el id [${matchId}] ❌ !`,
        match: null,
      };
    }

    return {
      ok: true,
      message: '¡ Encuentro obtenido correctamente 👍 !',
      match,
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
