'use server';

import prisma from '@/lib/prisma';
import deleteImage from '@/shared/actions/deleteImageAction';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteTeamImageAction = async (teamId: string): ResponseDeleteAction => {
  const team = await prisma.team.findFirst({
    where: { id: teamId },
    select: {
      name: true,
      imagePublicID: true,
    },
  });

  if (!team) {
    return {
      ok: false,
      message: '¡ No se puede eliminar la imagen, quizás fue eliminada ó no existe !',
    };
  }

  await prisma.team.update({
    where: { id: teamId },
    data: {
      imageUrl: null,
      imagePublicID: null,
    },
  });

  // Delete image from cloudinary.
  if (team.imagePublicID) {
    const response = await deleteImage(team.imagePublicID);
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen de cloudinary');
    }
  }

  // Update Cache
  updateTag('admin-teams');
  updateTag('admin-team');
  updateTag('public-teams');
  updateTag('public-team');

  return {
    ok: true,
    message: '¡ La imagen ha sido eliminada correctamente 👍 !',
  };
};
