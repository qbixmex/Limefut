'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteMatchAction = async (id: string): ResponseDeleteAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
    };
  }

  try {
    const match = await prisma.match.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!match) {
      return {
        ok: false,
        message: 'No se puede eliminar el encuentro, quizás fue eliminado ó no existe',
      };
    }

    await prisma.match.delete({ where: { id: match.id } });

    updateTag('admin-matches');
    updateTag('admin-match');
    updateTag('matches');
    updateTag('dashboard-results');
    updateTag('public-matches');
    updateTag('public-results-roles');
    updateTag('public-result-details');
    updateTag('public-matches-count');
    updateTag('admin-tournament-for-match');
    updateTag('public-team-matches');
    updateTag('public-team-standings');
    updateTag('public-playoff-matches');
    updateTag('public-playoff');

    return {
      ok: true,
      message: 'El encuentro ha sido eliminado correctamente',
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
        errorMessage = 'Error al eliminar el encuentro';
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
