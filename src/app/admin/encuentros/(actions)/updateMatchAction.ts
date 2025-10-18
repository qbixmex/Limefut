'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { editMatchSchema } from '@//shared/schemas';
import { type Match } from '@/shared/interfaces';
import { MATCH_STATUS } from '@/shared/enums';

type Options = {
  formData: FormData;
  id: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  match: Match | null;
}>;

export const updateMatchAction = async ({
  formData,
  id,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      match: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      match: null,
    };
  }

  const rawData = {
    local: formData.get('local') ?? '',
    localScore: parseInt(formData.get('localScore') as string) ?? undefined,
    visitor: formData.get('visitor') ?? undefined,
    visitorScore: parseInt(formData.get('visitorScore') as string) ?? undefined,
    place: formData.get('place') ?? '',
    matchDate: new Date(formData.get('matchDate') as string) ?? new Date(),
    week: parseInt(formData.get('week') as string) ?? 1,
    referee: formData.get('referee') ?? '',
    status: formData.get('status') ?? MATCH_STATUS.SCHEDULED,
    tournamentId: formData.get('tournamentId') ?? undefined,
  };

  const matchVerified = editMatchSchema.safeParse(rawData);

  if (!matchVerified.success) {
    return {
      ok: false,
      message: matchVerified.error.message,
      match: null,
    };
  }

  const { tournamentId, ...matchToSave } = matchVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isMatchExists = await transaction.match.count({
          where: { id },
        });

        if (!isMatchExists) {
          return {
            ok: false,
            message: '¡ El encuentro no existe o ha sido eliminado !',
            match: null,
          };
        }

        const tournament = await transaction.tournament.count({
          where: { id: tournamentId }
        });

        if (!tournament) {
          return {
            ok: false,
            message: `¡ El torneo con el ID: "${tournamentId}" no existe !`,
            match: null,
          };
        }

        const updatedMatch = await transaction.match.update({
          where: { id },
          data: {
            ...matchToSave,
            status: matchToSave.status as MATCH_STATUS,
            tournamentId,
          },
          include: {
            tournament: {
              select: {
                id: true,
                name: true,
              },
            },
          }
        });

        // Revalidate Cache
        revalidatePath('/admin/encuentros');

        return {
          ok: true,
          message: '¡ El encuentro fue actualizado correctamente 👍 !',
          match: {
            ...updatedMatch,
            localScore: updatedMatch.localScore as number,
            visitorScore: updatedMatch.visitorScore as number,
            status: updatedMatch.status as MATCH_STATUS,
          },
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              match: null,
            };
          }
          console.log(error.message);
          return {
            ok: false,
            message: '¡ Error al actualizar el encuentro, revise los logs del servidor !',
            match: null,
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
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
