'use server';

import prisma from "@/lib/prisma";
import { deleteImage } from "@/shared/actions";
import { revalidatePath, updateTag } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTournamentAction = async (id: string): ResponseDeleteAction => {
  const tournament = await prisma.tournament.findUnique({
    where: { id },
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
    where: { id },
  });

  // Delete image from cloudinary.
  if (tournament.imagePublicID) {
    const response = await deleteImage(tournament.imagePublicID);
    if (!response.ok) {
      throw 'Error al eliminar la imagen de cloudinary';
    }
  }

  // Update Cache
  revalidatePath('/admin/torneos');
  updateTag("public-tournaments-list");
  updateTag("public-tournaments");
  updateTag("public-tournament");

  return {
    ok: true,
    message: `¡ El torneo "${tournament.name}" ha sido eliminado correctamente 👍 !`,
  };
};
