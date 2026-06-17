'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteMatchAction = async (id: string): ResponseDeleteAction => {
  const match = await prisma.match.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!match) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el encuentro, quizás fue eliminado ó no existe !',
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
    message: '¡ El encuentro ha sido eliminado correctamente 👍 !',
  };
};
