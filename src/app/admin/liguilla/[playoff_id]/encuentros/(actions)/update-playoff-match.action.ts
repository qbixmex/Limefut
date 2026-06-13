'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { EditPlayoffsMatchSchema } from '@/shared/schemas';
import type { ROUND_TYPE, MATCH_STATUS_TYPE } from '@/shared/enums';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  match: { id: string } | null;
}>;

export const updatePlayoffMatchAction = async ({
  formData,
  matchId,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  formData: FormData;
  matchId: string;
}): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      match: null,
    };
  }

  if (authenticatedUserRoles && !authenticatedUserRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      match: null,
    };
  }

  const rawData = {
    localTeamId: formData.get('localTeamId') ?? undefined,
    visitorTeamId: formData.get('visitorTeamId') ?? undefined,
    localTeamScore: formData.has('localTeamScore')
      ? Number(formData.get('localTeamScore'))
      : undefined,
    visitorTeamScore: formData.has('visitorTeamScore')
      ? Number(formData.get('visitorTeamScore'))
      : undefined,
    referee: formData.get('referee') ?? undefined,
    fieldId: formData.get('fieldId') ?? undefined,
    matchDate: formData.has('matchDate')
      ? new Date(formData.get('matchDate') as string)
      : undefined,
    remarks: formData.get('remarks') ?? undefined,
    group: formData.get('group') ?? undefined,
    round: formData.get('round') ?? undefined,
    status: formData.get('status') ?? undefined,
  };

  const matchVerified = EditPlayoffsMatchSchema.safeParse(rawData);

  if (!matchVerified.success) {
    return {
      ok: false,
      message: matchVerified.error.message,
      match: null,
    };
  }

  const matchData = matchVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isMatchExists = await transaction.playoffMatch.count({
          where: { id: matchId },
        });

        if (!isMatchExists) {
          return {
            ok: false,
            message: '¡ El encuentro no existe o ha sido eliminado !',
            match: null,
          };
        }

        let position: number | undefined = 0;

        switch (matchData.group) {
          case 'gold':
            position = 1;
            break;
          case 'silver':
            position = 2;
            break;
          default:
            position = undefined;
        }

        const updatedMatch = await transaction.playoffMatch.update({
          where: { id: matchId },
          data: {
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

        const winnerId = setMatchWinner({
          localTeamId: matchData.localTeamId as string,
          localTeamScore: matchData.localTeamScore ?? 0,
          visitorTeamId: matchData.visitorTeamId as string,
          visitorTeamScore: matchData.visitorTeamScore ?? 0,
        });

        await transaction.playoffMatch.update({
          where: { id: matchId },
          data: { winnerId },
        });

        // Update Cache
        updateTag('admin-playoff-matches');
        updateTag('admin-playoff-match');

        return {
          ok: true,
          message: '¡ El encuentro fue actualizado correctamente 👍 !',
          match: updatedMatch,
        };
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
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      match: null,
    };
  }
};

const setMatchWinner = ({
  localTeamId,
  localTeamScore,
  visitorTeamId,
  visitorTeamScore,
}: {
  localTeamId: string,
  localTeamScore: number,
  visitorTeamId: string,
  visitorTeamScore: number,
}): string | null => {
  switch (true) {
    case localTeamScore > visitorTeamScore:
      return localTeamId;
    case visitorTeamScore === localTeamScore:
      return null;
    case visitorTeamScore > localTeamScore:
      return visitorTeamId;
    default:
      return null;
  }
};
