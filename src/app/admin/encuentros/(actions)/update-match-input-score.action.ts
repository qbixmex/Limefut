'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

type Params = Readonly<{
  matchId: string;
  score: number;
  local: boolean;
  visitor: boolean;
}>;

export const updateMatchInputScoreAction = async (params: Params): ResponseAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
    };
  }

  const { matchId, score, local, visitor } = params;

  try {
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        localScore: local ? score : undefined,
        visitorScore: visitor ? score : undefined,
      },
    });

    if (!updatedMatch) {
      return {
        ok: false,
        message: 'No se pudo actualizar el marcador del partido',
      };
    }

    updateTag('admin-matches');
    updateTag(`admin-match-${updatedMatch.id}`);
    updateTag('matches');
    updateTag('dashboard-results');
    updateTag('public-matches');
    updateTag('public-results-roles');
    updateTag('public-result-details');
    updateTag('public-matches-count');
    updateTag('public-team-standings');

    return {
      ok: true,
      message: 'El marcador del partido fue actualizado correctamente',
    };
  } catch (error) {
    let errorMessage = 'Error inesperado';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const fieldError = (error.meta as { target?: string[] } | undefined)?.target?.[0];

      if (error.code === 'P2001') {
        errorMessage = `El campo "${fieldError}" no existe`;
      } else if (error.code === 'P2002') {
        errorMessage = `El campo "${fieldError}" está duplicado`;
      } else {
        errorMessage = 'Error al actualizar el marcador del partido';
      }

      console.log('='.repeat(20) + ' PRISMA ERROR ' + '='.repeat(20));
      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('META:', error.meta);
      console.log('MESSAGE:', error.message);
      console.log('='.repeat(54));
    } else if (error instanceof Error) {
      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('MESSAGE:', error.message);
    } else {
      console.log(error);
    }

    return {
      ok: false,
      message: `${errorMessage}, revise los logs del servidor`,
    };
  }
};
