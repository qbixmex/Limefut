'use server';

import prisma from "@/lib/prisma";
import { createMatchSchema } from "@/shared/schemas";
import { revalidatePath } from "next/cache";
import type { Match } from "@/shared/interfaces";
import { MATCH_STATUS } from "@/shared/enums";

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  match: Match | null;
}>;

export const createMatchAction = async (
  formData: FormData,
  userRole: string[] | null,
): CreateResponseAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      match: null,
    };
  }

  const rawData = {
    localTeamId: formData.get('localTeamId') ?? '',
    visitorTeamId: formData.get('visitorTeamId') ?? '',
    place: formData.get('place') ?? '',
    matchDate: new Date(formData.get('matchDate') as string) ?? new Date(),
    week: parseInt(formData.get('week') as string) ?? 1,
    referee: formData.get('referee') ?? '',
    status: formData.get('status') ?? MATCH_STATUS.SCHEDULED,
    tournamentId: formData.get('tournamentId') ?? undefined,
  };

  const matchVerified = createMatchSchema.safeParse(rawData);

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

      const createdMatch = await transaction.match.create({
        data: {
          localId: matchToSave.localTeamId,
          visitorId: matchToSave.visitorTeamId,
          place: matchToSave.place,
          week: matchToSave.week,
          referee: matchToSave.referee,
          matchDate: matchToSave.matchDate,
          localScore: 0,
          visitorScore: 0,
          status: matchToSave.status as MATCH_STATUS,
          tournamentId,
        },
        select: {
          id: true,
          localId: true,
          visitorId: true,
          place: true,
          matchDate: true,
          week: true,
          referee: true,
          localScore: true,
          visitorScore: true,
          status: true,
          createdAt: true,
          updatedAt: true,
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
          tournament: {
            select: {
              id: true,
              name: true,
            },
          },
        }
      });

      return {
        ok: true,
        message: '¡ Encuentro creado correctamente 👍 !',
        match: {
          ...createdMatch,
          localTeam: createdMatch.local,
          visitorTeam: createdMatch.visitor,
          localScore: createdMatch.localScore as number,
          visitorScore: createdMatch.visitorScore as number,
          status: createdMatch.status as MATCH_STATUS,
        },
      };
    });

    // Revalidate Paths
    revalidatePath('/admin/encuentros');

    return prismaTransaction;
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
      console.log("CAUSE:", error.cause);
      console.log("NAME:", error.name);
      console.log("META:", error.meta);
      console.log("MESSAGE:", error.message);
      console.log(error.message);
      return {
        ok: false,
        message: '¡ Error al crear el encuentro, revise los logs del servidor !',
        match: null,
      };
    }
    console.log((error as Error).message);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      match: null,
    };
  }
};
