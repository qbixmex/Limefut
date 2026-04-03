'use server';

import prisma from '@/lib/prisma';
import { deleteImage } from '@/shared/actions';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteSponsorAction = async (sponsorId: string): ResponseDeleteAction => {
  const sponsor = await prisma.sponsor.findFirst({
    where: { id: sponsorId },
    select: {
      name: true,
      imagePublicId: true,
    },
  });

  if (!sponsor) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el patrocinador, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.sponsor.delete({
    where: { id: sponsorId },
  });

  // Delete image from cloudinary.
  if (sponsor.imagePublicId) {
    const response = await deleteImage(sponsor.imagePublicId);
    if (!response.ok) {
      throw new Error('Error al eliminar la imagen de cloudinary');
    }
  }

  // Update Cache
  updateTag('admin-sponsors');
  updateTag('admin-sponsor');
  updateTag('public-sponsors');

  return {
    ok: true,
    message: `¡ El patrocinador "${sponsor.name}", ha sido eliminado correctamente 👍 !`,
  };
};
