'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import deleteImage from '@/shared/actions/deleteImageAction';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePlayerImageAction = async (playerId: string): ResponseDeleteAction => {
  const player = await prisma.player.findFirst({
    where: { id: playerId },
    select: {
      name: true,
      imagePublicID: true,
    },
  });

  if (!player) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la imagen del jugador, quizás fue eliminada ó no existe !',
    };
  }

  await prisma.player.update({
    where: { id: playerId },
    data: {
      imageUrl: null,
      imagePublicID: null,
    },
  });

  // Delete image from cloudinary.
  if (player.imagePublicID) {
    const response = await deleteImage(player.imagePublicID);
    if (!response.ok) {
      throw 'Error al eliminar la imagen de cloudinary';
    }
  }

  // Update Cache
  updateTag('admin-players');
  updateTag('admin-player');
  updateTag('public-players');
  updateTag('public-player');

  return {
    ok: true,
    message: `¡ La imagen ha sido eliminada correctamente 👍 !`,
  };
};
