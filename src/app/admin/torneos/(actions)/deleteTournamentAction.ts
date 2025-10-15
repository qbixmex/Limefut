'use server';

import prisma from "@/lib/prisma";
import deleteImage from "@/shared/actions/deleteImageAction";
import { revalidatePath } from "next/cache";

export type ResponseDeleteTeam = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTournamentAction = async (teamId: string): ResponseDeleteTeam => {
  const teamDeleted = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      imagePublicID: true,
      name: true,
    },
  });

  if (!teamDeleted) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el equipo, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.team.delete({
    where: { id: teamId },
  });

  // Delete image from cloudinary.
  if (teamDeleted.imagePublicID) {
    const response = await deleteImage(teamDeleted.imagePublicID);
    if (!response.ok) {
      throw 'Error al eliminar la imagen de cloudinary';
    }
  }

  revalidatePath('/equipos');
  revalidatePath('/admin/equipos');

  return {
    ok: true,
    message: `¡ El equipo "${teamDeleted.name}" ha sido eliminado correctamente 👍 !`
  };
};
