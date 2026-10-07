'use server';

import { updateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/get-session';
import type { Video } from '@/shared/interfaces';
import { createVideoSchema } from '@/shared/schemas';
import { Prisma } from '@/generated/prisma/client';

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  video: Video | null;
}>;

export const createVideoAction = async (
  formData: FormData,
): ResponseCreateAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return { ok: false, message: guard.message, video: null };
  }

  const rawData = {
    title: formData.get('title') as string ?? '',
    permalink: formData.get('permalink') ?? '',
    url: formData.get('url') ?? '',
    platform: formData.get('platform') ?? '',
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
        message: 'Video creado satisfactoriamente',
        video: createdVideo,
      };
    });

    // Refresh Cache
    updateTag('admin-videos');
    updateTag('admin-video');
    updateTag('public-videos');

    return prismaTransaction;
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
          video: null,
        };
      }

      return {
        ok: false,
        message: 'Hubo errores de base de datos, revise los logs del servidor',
        video: null,
      };
    }

    if (error instanceof Error) {
      console.log('Error Name:', error.name);
      console.log('Error Message:', error.message);
      console.log('Error Cause:', error.cause ?? 'none');
      console.log('Error Stack:', error.stack ?? 'none');

      return {
        ok: false,
        message: 'No se pudo crear el video, revise los logs del servidor',
        video: null,
      };
    }

    console.log(error);

    return {
      ok: false,
      message: 'Error inesperado, revise los logs del servidor',
      video: null,
    };
  }
};
