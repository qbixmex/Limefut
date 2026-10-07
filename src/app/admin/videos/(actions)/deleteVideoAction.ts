'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

export type ResponseDeleteAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const deleteVideoAction = async (videoId: string): ResponseDeleteAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return { ok: false, message: guard.message };
  }

  try {
    const video = await prisma.video.findFirst({
      where: { id: videoId },
      select: { title: true },
    });

    if (!video) {
      return {
        ok: false,
        message: 'No se puede eliminar el video, quizás fue eliminada ó no existe',
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
      message: `El video "${video.title}", ha sido eliminado correctamente`,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('Error Name:', error.name);
      console.log('Error Code:', error.code);
      console.log('Error cause:', error.cause ?? 'none');
      console.log('Error Metadata:', error.meta ?? 'none');
      console.log('Error Message:', error.message);

      if (error.code === 'P2002') {
        return {
          ok: false,
          message: 'Hay campos duplicados, revise los logs del servidor',
        };
      }

      return {
        ok: false,
        message: 'Hubo errores de base de datos, revise los logs del servidor',
      };
    }

    if (error instanceof Error) {
      console.log('Error Name:', error.name);
      console.log('Error Message:', error.message);
      console.log('Error Cause:', error.cause ?? 'none');
      console.log('Error Stack:', error.stack ?? 'none');

      return {
        ok: false,
        message: 'No se pudo eliminar el video, revise los logs del servidor',
      };
    }

    console.log(error);

    return {
      ok: false,
      message: 'Error inesperado, revise los logs del servidor',
    };
  }
};
