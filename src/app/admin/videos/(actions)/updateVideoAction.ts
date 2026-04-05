'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { editAnnouncementSchema } from '@/shared/schemas';
import type { Announcement } from '@/shared/interfaces';

type Options = {
  formData: FormData;
  videoId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  announcement: Announcement | null;
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
      announcement: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      announcement: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string ?? '',
    permalink: formData.get('permalink') ?? '',
    publishedDate: formData.get('publishedDate') ? new Date(formData.get('publishedDate') as string) : null,
    description: formData.get('description') ?? '',
    content: formData.get('content') ?? '',
    image: formData.get('image') as File,
    active: formData.get('active') === 'true',
  };

  const announcementVerified = editAnnouncementSchema.safeParse(rawData);

  if (!announcementVerified.success) {
    return {
      ok: false,
      message: announcementVerified.error.issues[0].message,
      announcement: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const announcementExists = await transaction.announcement.count({
          where: { id: videoId },
        });

        if (!announcementExists) {
          return {
            ok: false,
            message: '¡ El video no existe o ha sido eliminado !',
            announcement: null,
          };
        }

        const titleDuplicated = await transaction.announcement.count({
          where: {
            title: announcementVerified.data.title as string,
            id: { not: announcementId }, // Exclude current page
          },
        });

        if (titleDuplicated > 0) {
          return {
            ok: false,
            message: '¡ Ya existe una noticia con ese título !',
            announcement: null,
          };
        }

        const permalinkDuplicated = await transaction.announcement.count({
          where: {
            permalink: announcementVerified.data.permalink as string,
            id: { not: announcementId }, // Exclude current page
          },
        });

        if (permalinkDuplicated > 0) {
          return {
            ok: false,
            message: '¡ Ya existe una noticia con ese enlace permanente !',
            announcement: null,
          };
        }

        const updatedAnnouncement = await transaction.announcement.update({
          where: { id: announcementId },
          data: announcementVerified.data,
        });

        // Update Cache
        updateTag('admin-announcements');
        updateTag('admin-announcement');
        updateTag('public-announcement');

        return {
          ok: true,
          message: '¡ La noticia fue actualizada correctamente 👍 !',
          announcement: updatedAnnouncement,
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              announcement: null,
            };
          }

          console.log('Name:', error.name);
          console.log('Cause:', error.cause);
          console.log('Message:', error.message);

          return {
            ok: false,
            message: '¡ Error al actualizar la noticia, revise los logs del servidor !',
            announcement: null,
          };
        }
        console.log((error as Error).message);
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          announcement: null,
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
      announcement: null,
    };
  }
};
