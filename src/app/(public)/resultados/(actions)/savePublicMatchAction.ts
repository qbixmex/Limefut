'use server';

import prisma from '@/lib/prisma';
import { MATCH_STATUS } from '@/shared/enums';
import { SaveMatchSchema } from '@/shared/schemas';
import { updateTag } from 'next/cache';

type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const savePublicMatchAction = async (formData: FormData): ResponseAction => {
  const rawData = {
    localTeamId: formData.get('localTeamId') ?? '',
    visitorTeamId: formData.get('visitorTeamId') ?? '',
    localTeamScore: formData.get('localTeamScore')
      ? Number(formData.get('localTeamScore'))
      : 0,
    visitorTeamScore: formData.get('visitorTeamScore')
      ? Number(formData.get('visitorTeamScore'))
      : 0,
    localPenaltyShoots: formData.get('localPenaltyShoots')
      ? Number(formData.get('localPenaltyShoots'))
      : 0,
    visitorPenaltyShoots: formData.get('visitorPenaltyShoots')
      ? Number(formData.get('visitorPenaltyShoots'))
      : 0,
    category: formData.get('category') ?? '',
    field: formData.get('field') ?? undefined,
    matchDate: new Date(formData.get('matchDate') as string),
    referee: formData.get('referee') ?? undefined,
    remarks: formData.get('remarks') ?? undefined,
  };

  const matchVerified = SaveMatchSchema.safeParse(rawData);

  if (!matchVerified.success) {
    return {
      ok: false,
      message: matchVerified.error.message,
    };
  }

  const {
    category: categoryPermalink,
    ...matchToSave
  } = matchVerified.data;

  const tournament = await prisma.tournament.findFirst({
    where: { category: categoryPermalink },
    select: { id: true },
  });

  if (!tournament) {
    return {
      ok: false,
      message: `No se encontró un torneo asociado con la categoría: (${categoryPermalink})`,
    };
  }

  const category = await prisma.category.findFirst({
    where: { permalink: categoryPermalink },
    select: { id: true },
  });

  if (!category) {
    return {
      ok: false,
      message: `No se encontró una categoría con el enlace permanente: (${categoryPermalink})`,
    };
  }

  if (matchToSave.localPenaltyShoots && matchToSave.localPenaltyShoots) {
    if (matchToSave.localPenaltyShoots === matchToSave.visitorPenaltyShoots) {
      return {
        ok: false,
        message: '¡ El resultado de la tanda de penales no puede ser empate !',
      };
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const savedMatch = await transaction.match.create({
        data: {
          localId: matchToSave.localTeamId,
          visitorId: matchToSave.visitorTeamId,
          localScore: matchToSave.localTeamScore,
          visitorScore: matchToSave.visitorTeamScore,
          fieldId: matchToSave.field,
          referee: matchToSave.referee,
          matchDate: matchToSave.matchDate,
          status: MATCH_STATUS.IN_REVIEW,
          tournamentId: tournament.id,
          categoryId: category.id,
          remarks: matchToSave.remarks,
          week: 0,
        },
        select: { id: true },
      });

      if (matchToSave.localTeamScore === matchToSave.visitorTeamScore) {
        let winnerTeamId = '';

        const localPenaltyShoots = matchToSave.localPenaltyShoots as number;
        const visitorPenaltyShoots = matchToSave.visitorPenaltyShoots as number;

        if (localPenaltyShoots > visitorPenaltyShoots) {
          winnerTeamId = matchToSave.localTeamId;
        }

        if (localPenaltyShoots < visitorPenaltyShoots) {
          winnerTeamId = matchToSave.visitorTeamId;
        }

        const penaltyShoots = await transaction.penaltyShootout.create({
          data: {
            matchId: savedMatch.id,
            localTeamId: matchToSave.localTeamId,
            visitorTeamId: matchToSave.visitorTeamId,
            localGoals: matchToSave.localPenaltyShoots,
            visitorGoals: matchToSave.visitorPenaltyShoots,
            winnerTeamId,
            status: MATCH_STATUS.COMPLETED,
          },
        });

        console.log('PENALTY SHOOTS:', penaltyShoots);
      }

      return {
        ok: true,
        message: 'El encuentro fue guardado satisfactoriamente ⚽️👍',
      };
    });

    // Update Cache
    updateTag('admin-matches');
    updateTag('admin-match');
    updateTag('matches');
    updateTag('dashboard-results');
    updateTag('admin-tournament-for-match');
    updateTag('admin-teams-for-match');
    updateTag('public-matches');
    updateTag('public-results-roles');
    updateTag('public-result-details');
    updateTag('public-matches-count');
    updateTag('public-team-matches');
    updateTag('public-team-standings');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
        };
      }
      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('META:', error.meta);
      console.log('MESSAGE:', error.message);
      console.log(error.message);
      return {
        ok: false,
        message: '¡ Error al crear el encuentro, revise los logs del servidor !',
      };
    }
    console.log((error as Error).message);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
    };
  }
};
