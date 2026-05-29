'use server';

import { updateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import type { Announcement } from '@/shared/interfaces';
import { CreateAnnouncementSchema } from '@/shared/schemas';

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  announcement: Announcement | null;
}>;

export const createAnnouncementAction = async ({
  formData,
  authenticatedUserId,
  authenticatedUserRoles,
} : {
  formData: FormData,
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}): ResponseCreateAction => {
  if ((!authenticatedUserId)) {
    return {
      ok: false,
      message: '¡ Tienes que estar autentificado para realizar esta acción !',
      announcement: null,
    };
  }

  if ((!authenticatedUserRoles?.includes('admin'))) {
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

  const announcementVerified = CreateAnnouncementSchema.safeParse(rawData);

  if (!announcementVerified.success) {
    return {
      ok: false,
      message: announcementVerified.error.issues[0].message,
      announcement: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdAnnouncement = await transaction.announcement.create({
        data: announcementVerified.data,
      });

      return {
        ok: true,
        message: '¡ Noticia creada satisfactoriamente 👍 !',
        announcement: createdAnnouncement,
      };
    });

    // Refresh Cache
    updateTag('admin-announcements');
    updateTag('admin-announcement');
    updateTag('public-announcements');

    return prismaTransaction;
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
        message: '¡ Error al crear la noticia, revise los logs del servidor !',
        announcement: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      announcement: null,
    };
  }
};
