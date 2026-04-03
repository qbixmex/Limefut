'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateSponsorStateAction = async (id: string, state: boolean): ResponseAction => {
  const sponsorExists = await prisma.sponsor.count({
    where: { id },
  });

  if (sponsorExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el patrocinador, quizás fue eliminado ó no existe !',
    };
  }

  const updatedSponsor = await prisma.sponsor.update({
    where: { id },
    data: { active: state },
    select: { active: true },
  });

  // Update Cache
  updateTag('admin-sponsors');
  updateTag('admin-sponsor');
  updateTag('public-sponsors');

  return {
    ok: true,
    message: `¡ El patrocinador fue ${updatedSponsor.active ? 'activado' : 'desactivado'} correctamente 👍 !`,
  };
};
