'use server';

import prisma from "@/lib/prisma";
import deleteImage from "@/shared/actions/deleteImageAction";
import { revalidatePath } from "next/cache";

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deletePlayerAction = async (coachId: string): ResponseDeleteAction => {
  const coach = await prisma.coach.findUnique({
    where: { id: coachId },
    select: {
      imagePublicID: true,
      name: true,
    },
  });

  if (!coach) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el entrenador, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.coach.delete({
    where: { id: coachId },
  });

  // Delete image from cloudinary.
  if (coach.imagePublicID) {
    if (coach.imagePublicID) {
      const response = await deleteImage(coach.imagePublicID);
      if (!response.ok) {
        throw 'Error al eliminar la imagen de cloudinary';
      }
    }
  }

  revalidatePath('/entrenadores');
  revalidatePath('/admin/entrenadores');

  return {
    ok: true,
    message: `¡ El entrenador "${coach.name}" ha sido eliminado correctamente 👍 !`
  };
};
