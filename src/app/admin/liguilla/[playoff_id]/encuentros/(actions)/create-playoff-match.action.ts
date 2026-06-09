'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS_TYPE, ROUND_TYPE } from '@/shared/enums';
import { CreatePlayoffsMatchSchema } from '@/shared/schemas';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { updateTag } from 'next/cache';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  match: { id: string; } | null;
}>;

export const createPlayoffMatchAction = async ({
  authenticatedUserId,
  authenticatedUserRoles,
  playoffId,
  formData,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  playoffId: string;
  formData: FormData;
}): CreateResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
      match: null,
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      match: null,
    };
  }

  const rawData = {
    localTeamId: formData.get('localTeamId') ?? '',
    visitorTeamId: formData.get('visitorTeamId') ?? '',
    localTeamScore: formData.has('localTeamScore')
      ? Number(formData.get('localTeamScore'))
      : 0,
    visitorTeamScore: formData.has('visitorTeamScore')
      ? Number(formData.get('visitorTeamScore'))
      : 0,
    referee: formData.get('referee') ?? undefined,
    fieldId: formData.get('fieldId') ?? '',
    matchDate: formData.has('matchDate')
      ? new Date(formData.get('matchDate') as string)
      : undefined,
    remarks: formData.get('remarks') ?? undefined,
    group: formData.get('group') ?? undefined,
    round: formData.get('round') ?? undefined,
    status: formData.get('status') ?? undefined,
  };

  const matchVerified = CreatePlayoffsMatchSchema.safeParse(rawData);

  if (!matchVerified.success) {
    console.log(matchVerified.error.message);
    return {
      ok: false,
      message: matchVerified.error.message,
      match: null,
    };
  }
  const matchData = matchVerified.data;

  const playoff = await prisma.playoff.count({
    where: { id: playoffId },
  });

  if (playoff === 0) {
    return {
      ok: false,
      message: '¡ No se encontró la liguilla !',
      match: null,
    };
  }

  let position = 0;

  switch (matchData.group) {
    case 'gold':
      position = 1;
      break;
    case 'silver':
      position = 2;
      break;
    default:
      position = 0;
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const match = await transaction.playoffMatch.create({
        data: {
          playoffId,
          position,
          round: matchData.round as ROUND_TYPE,
          localId: matchData.localTeamId,
          visitorId: matchData.visitorTeamId,
          localScore: matchData.localTeamScore,
          visitorScore: matchData.visitorTeamScore,
          referee: matchData.referee,
          fieldId: matchData.fieldId,
          matchDate: matchData.matchDate,
          remarks: matchData.remarks,
          group: matchData.group,
          status: matchData.status as MATCH_STATUS_TYPE,
        },
        select: { id: true },
      });

      return {
        ok: true,
        message: '¡ Encuentro creado correctamente 👍 !',
        match,
      };
    });

    // Update Cache
    updateTag('admin-playoffs-matches');
    updateTag('admin-playoff-match');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        if (error.meta) {
          console.log('ERROR METADATA:', error.meta);
        }

        return {
          ok: false,
          message: '¡ Hay campos duplicados, revise los logs del servidor !',
          match: null,
        };
      }

      console.log('NAME:', error.name);
      console.log('CAUSE:', error.cause);
      console.log('MESSAGE:', error.message);
      console.log(error.message);

      return {
        ok: false,
        message: '¡ Error al crear el encuentro, revise los logs del servidor !',
        match: null,
      };
    }

    if (error instanceof Error) {
      console.log('ERROR NAME:', error.name);
      console.log('ERROR CAUSE:', error.cause);
      console.log('ERROR MESSAGE:', error.message);

      return {
        ok: false,
        message: '¡ Error al crear la cancha, revise los logs del servidor !',
        match: null,
      };
    }

    console.log('ERROR NAME:', (error as Error).name);
    console.log('ERROR CAUSE:', (error as Error).cause);
    console.log('ERROR MESSAGE:', (error as Error).message);

    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      match: null,
    };
  }
};
