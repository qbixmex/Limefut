'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import { deleteImage } from "@/shared/actions";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTournamentAction = async (tournamentId: string): ResponseDeleteAction => {
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
      message: '¡ No se puede eliminar el torneo, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.tournament.delete({
    where: { id: tournamentId },
  });

  // Delete image from cloudinary.
  if (tournament.imagePublicID) {
    const response = await deleteImage(tournament.imagePublicID);
    if (!response.ok) {
      throw 'Error al eliminar la imagen de cloudinary';
    }
  }

  // Update Cache
  updateTag("admin-tournaments");
  updateTag("admin-tournaments-selector");
  updateTag("admin-tournaments-for-match");
  updateTag("admin-tournament-for-match");
  updateTag("admin-tournaments-for-gallery");
  updateTag("admin-tournament");
  updateTag("public-tournaments-list");
  updateTag("tournaments-list");
  updateTag("public-tournaments");
  updateTag("public-tournament");
  updateTag("dashboard-tournaments");

  return {
    ok: true,
    message: `¡ El torneo "${tournament.name}" ha sido eliminado correctamente 👍 !`,
  };
};
