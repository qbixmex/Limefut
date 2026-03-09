'use server';

import prisma from "@/lib/prisma";
import deleteImage from "@/shared/actions/deleteImageAction";
import { updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTournamentImageAction = async (tournamentId: string): ResponseDeleteAction => {
  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId },
    select: {
      name: true,
      imagePublicID: true,
    },
  });

  if (!tournament) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la imagen del torneo, quizás fue eliminada ó no existe !',
    };
  }

  await prisma.tournament.update({
    where: { id: tournamentId },
    data: {
      imageUrl: null,
      imagePublicID: null,
    },
  });

  // Delete image from cloudinary.
  if (tournament.imagePublicID) {
    const response = await deleteImage(tournament.imagePublicID);
    if (!response.ok) {
      throw 'Error al eliminar la imagen de cloudinary';
    }
  }

  // Update Cache
  updateTag('admin-tournaments');
  updateTag('admin-tournament');
  updateTag('public-tournaments');
  updateTag('public-tournament');

  return {
    ok: true,
    message: `¡ La imagen ha sido eliminada correctamente 👍 !`,
  };
};
