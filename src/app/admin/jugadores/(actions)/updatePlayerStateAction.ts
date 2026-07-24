'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updatePlayerStateAction = async ({
  id,
  state,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  id: string;
  state: boolean;
  authenticatedUserId: string | undefined | null;
  authenticatedUserRoles: string[] | null | undefined;
}): ResponseDeleteAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
    };
  }

  if (!authenticatedUserRoles?.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
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
