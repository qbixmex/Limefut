'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { editVideoSchema } from '@/shared/schemas';
import type { Video } from '@/shared/interfaces';

type Options = {
  formData: FormData;
  videoId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  video: Video | null;
}>;

export const updateVideoAction = async ({
  formData,
  videoId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      video: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      video: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string ?? '',
    permalink: formData.get('permalink') ?? '',
    publishedDate: formData.get('publishedDate') ? new Date(formData.get('publishedDate') as string) : null,
    url: formData.get('url') ?? '',
    platform: formData.get('platform') ?? '',
    description: formData.get('description') ?? '',
    image: formData.get('image') as File,
    active: formData.get('active') === 'true',
  };

  const videoVerified = editVideoSchema.safeParse(rawData);

  if (!videoVerified.success) {
    return {
      ok: false,
      message: videoVerified.error.issues[0].message,
      video: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const videoExists = await transaction.video.count({
          where: { id: videoId },
        });

        if (!videoExists) {
          return {
            ok: false,
            message: '¡ El video no existe o ha sido eliminado !',
            video: null,
          };
        }

        const titleDuplicated = await transaction.video.count({
          where: {
            title: videoVerified.data.title as string,
            id: { not: videoId }, // Exclude current page
          },
        });

        if (titleDuplicated > 0) {
          return {
            ok: false,
            message: '¡ Ya existe un video con ese título !',
            video: null,
          };
        }

        const permalinkDuplicated = await transaction.video.count({
          where: {
            permalink: videoVerified.data.permalink as string,
            id: { not: videoId }, // Exclude current page
          },
        });

        if (permalinkDuplicated > 0) {
          return {
            ok: false,
            message: '¡ Ya existe un video con ese enlace permanente !',
            video: null,
          };
        }

        const updatedVideo = await transaction.video.update({
          where: { id: videoId },
          data: videoVerified.data,
        });

        // Update Cache
        updateTag('admin-videos');
        updateTag('admin-video');
        updateTag('public-videos');
        updateTag('public-video');

        return {
          ok: true,
          message: '¡ El video fue actualizado correctamente 👍 !',
          video: updatedVideo,
        };
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
            message: '¡ Error al actualizar el video, revise los logs del servidor !',
            video: null,
          };
        }
        console.log((error as Error).message);
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          video: null,
        };
      }
    });

    // Update Cache
    updateTag('admin-sponsors');
    updateTag('admin-sponsor');
    updateTag('public-sponsors');

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      video: null,
    };
  }
};
