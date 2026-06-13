'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePlayoffMatchAction = async (id: string): ResponseDeleteAction => {
  const match = await prisma.playoffMatch.findFirst({
    where: { id },
    select: { id: true },
  });

  if (!match) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el jugador, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.playoffMatch.delete({ where: { id: match.id } });

  updateTag('admin-playoff-matches');
  updateTag('admin-playoff-match');
  updateTag('public-playoff-matches');
  updateTag('public-playoff-match');

  return {
    ok: true,
    message: '¡ El encuentro ha sido eliminado correctamente 👍 !',
  };
};
