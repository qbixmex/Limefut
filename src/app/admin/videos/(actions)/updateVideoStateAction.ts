'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateVideoStateAction = async (id: string, state: boolean): ResponseAction => {
  const videoExists = await prisma.video.count({
    where: { id },
  });

  if (videoExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el video, quizás fue eliminado ó no existe !',
    };
  }

  const video = await prisma.video.update({
    where: { id },
    data: { active: state },
    select: { active: true },
  });

  // Update Cache
  updateTag('admin-videos');
  updateTag('admin-video');
  updateTag('public-videos');
  updateTag('public-video');

  return {
    ok: true,
    message: `¡ El video fue ${video.active ? 'activado' : 'desactivado'} correctamente 👍 !`,
  };
};
