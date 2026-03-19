'use server';

import prisma from '@/lib/prisma';
import deleteImage from '@/shared/actions/deleteImageAction';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteCoachImageAction = async (coachId: string): ResponseDeleteAction => {
  const coach = await prisma.coach.findFirst({
    where: { id: coachId },
    select: {
      name: true,
      imagePublicID: true,
    },
  });

  if (!coach) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la imagen del entrenador, quizás fue eliminada ó no existe !',
    };
  }

  await prisma.coach.update({
    where: { id: coachId },
    data: {
      imageUrl: null,
      imagePublicID: null,
    },
  });

  // Delete image from cloudinary.
  if (coach.imagePublicID) {
    const response = await deleteImage(coach.imagePublicID);
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen de cloudinary');
    }
  }

  // Update Cache
  updateTag('admin-coaches');
  updateTag('admin-coach');
  updateTag('public-coaches');
  updateTag('public-coach');

  return {
    ok: true,
    message: '¡ La imagen ha sido eliminada correctamente 👍 !',
  };
};
