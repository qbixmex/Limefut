'use server';

import { updateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import type { Video } from '@/shared/interfaces';
import { createVideoSchema } from '@/shared/schemas';

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  video: Video | null;
}>;

export const createVideoAction = async (
  formData: FormData,
  userRole: string[] | null,
): ResponseCreateAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      video: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string ?? '',
    permalink: formData.get('permalink') ?? '',
    url: formData.get('url') ?? '',
    publishedDate: formData.get('publishedDate') ? new Date(formData.get('publishedDate') as string) : null,
    description: formData.get('description') ?? '',
    image: formData.get('image') as File,
    active: formData.get('active') === 'true',
  };

  const videoVerified = createVideoSchema.safeParse(rawData);

  if (!videoVerified.success) {
    return {
      ok: false,
      message: videoVerified.error.issues[0].message,
      video: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdVideo = await transaction.video.create({
        data: videoVerified.data,
      });

      return {
        ok: true,
        message: '¡ Video creado satisfactoriamente 👍 !',
        video: createdVideo,
      };
    });

    // Refresh Cache
    updateTag('admin-videos');
    updateTag('admin-video');
    updateTag('public-videos');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          video: null,
        };
      }

      console.log('Name:', error.name);
      console.log('Cause:', error.cause);
      console.log('Message:', error.message);

      return {
        ok: false,
        message: '¡ Error al crear el video, revise los logs del servidor !',
        video: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      video: null,
    };
  }
};
