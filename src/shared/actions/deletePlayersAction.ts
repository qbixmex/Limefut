'use server';

import prisma from "@/lib/prisma";
import deleteImage from "@/shared/actions/deleteImageAction";
import { updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePlayersAction = async (teamId: string): ResponseDeleteAction => {
  const players = await prisma.player.findMany({
    where: { teamId },
    select: {
      name: true,
      imagePublicID: true,
      _count: {
        select: {
          penaltyKicks: true,
        },
      },
    },
  });

  // Check if the player has registered penalty kicks.
  for (const player of players) {
    if (player._count.penaltyKicks > 0) {
      return {
        ok: false,
        message: '¡ No se pueden eliminar todos los jugadores, '
          + ` por que el jugador ( ${player.name} ) tiene tiro de penales !`,
      };
    }
  }

  await prisma.player.deleteMany({
    where: { teamId },
  });

  // Delete images from cloudinary.
  for (const player of players) {
    if (player.imagePublicID) {
      if (player.imagePublicID) {
        const response = await deleteImage(player.imagePublicID);
        if (!response.ok) {
          throw 'Error al eliminar la imagen de cloudinary';
        }
      }
    }
  }

  // Update Cache
  updateTag('admin-players');
  updateTag('admin-teams');
  updateTag('admin-team');

  return {
    ok: true,
    message: `¡ Los jugadores fueron eliminados correctamente 👍 !`,
  };
};
