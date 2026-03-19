'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updatePlayerStateAction = async (id: string, state: boolean): ResponseDeleteAction => {
  const playerExists = await prisma.player.count({
    where: { id },
  });

  if (playerExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el jugador, quizás fue eliminado ó no existe !',
    };
  }

  const updatedTeam = await prisma.player.update({
    where: { id },
    data: { active: state },
    select: {
      name: true,
      active: true,
    },
  });

  // Update Cache
  updateTag('admin-players');
  updateTag('admin-player');

  return {
    ok: true,
    message: `¡ El jugador "${updatedTeam.name}" fue ${updatedTeam.active ? 'activado' : 'desactivado'} correctamente 👍 !`,
  };
};
