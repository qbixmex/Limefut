'use server';

import prisma from "@/lib/prisma";
import deleteImage from "@/shared/actions/deleteImageAction";
import { updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePlayerAction = async (playerId: string): ResponseDeleteAction => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      imagePublicID: true,
      name: true,
    },
  });

  if (!player) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el jugador, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.player.delete({
    where: { id: playerId },
  });

  // Delete image from cloudinary.
  if (player.imagePublicID) {
    if (player.imagePublicID) {
      const response = await deleteImage(player.imagePublicID);
      if (!response.ok) {
        throw 'Error al eliminar la imagen de cloudinary';
      }
    }
  }

  // Update Cache
  updateTag('admin-players');
  updateTag('admin-player');

  return {
    ok: true,
    message: `¡ El jugador "${player.name}" ha sido eliminado correctamente 👍 !`,
  };
};
