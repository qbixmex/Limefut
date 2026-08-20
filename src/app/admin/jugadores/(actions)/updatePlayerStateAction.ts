'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/get-session';
import { updateTag } from 'next/cache';

export const updatePlayerStateAction = async (
  id: string,
  state: boolean,
): Promise<{
  ok: boolean;
  message: string;
}> => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
    };
  }

  const playerExists = await prisma.player.count({
    where: { id },
  });

  if (playerExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el jugador, quizás fue eliminado ó no existe !',
    };
  }

  const updatedPlayer = await prisma.player.update({
    where: { id },
    data: { active: state },
    select: {
      name: true,
      active: true,
    },
  });

  updateTag('admin-players');
  updateTag('admin-player');
  updateTag('admin-playoff-match');

  return {
    ok: true,
    message: `¡ El jugador "${updatedPlayer.name}" fue ${updatedPlayer.active ? 'activado' : 'desactivado'} correctamente 👍 !`,
  };
};
