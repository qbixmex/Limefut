'use server';

import prisma from '@/lib/prisma';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateStatusAction = async (
  matchId: string,
  status: MATCH_STATUS_TYPE,
): ResponseAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
    };
  }

  try {
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: { status },
    });

    if (!updatedMatch) {
      return {
        ok: false,
        message: 'No se pudo actualizar el estado del partido',
      };
    }

    updateTag('admin-matches');
    updateTag(`admin-match-${updatedMatch.id}`);
    updateTag('matches');
    updateTag('dashboard-results');
    updateTag('public-matches');
    updateTag('public-results');
    updateTag('public-results-roles');
    updateTag('public-result-details');
    updateTag('public-matches-count');
    updateTag('public-team-matches');
    updateTag('public-team-standings');

    return {
      ok: true,
      message: 'El estado del partido fue actualizado correctamente',
    };
  } catch (error) {
    let errorMessage = 'Error inesperado';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2001') {
        errorMessage = 'No existe el encuentro';
      } else if (error.code === 'P2002') {
        errorMessage = 'Error de campos duplicados';
      } else {
        errorMessage = 'Error al actualizar el estado del partido';
      }

      console.log('CAUSE:', error.cause);
      console.log('NAME:', error.name);
      console.log('META:', error.meta);
      console.log('MESSAGE:', error.message);
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
