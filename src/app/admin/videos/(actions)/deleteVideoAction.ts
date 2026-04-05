'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteVideoAction = async (videoId: string): ResponseDeleteAction => {
  const video = await prisma.video.findFirst({
    where: { id: videoId },
    select: { title: true },
  });

  if (!video) {
    return {
      ok: false,
      message: '¡ No se puede eliminar el video, quizás fue eliminada ó no existe !',
    };
  }

  await prisma.video.delete({
    where: { id: videoId },
  });

  // Update Cache
  updateTag('admin-videos');
  updateTag('admin-video');
  updateTag('public-videos');
  updateTag('public-video');

  return {
    ok: true,
    message: `¡ El video "${video.title}", ha sido eliminado correctamente 👍 !`,
  };
};
