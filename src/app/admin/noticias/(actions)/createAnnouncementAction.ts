'use server';

import { updateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/shared/actions';
import type { CloudinaryResponse, Announcement } from '@/shared/interfaces';
import { createAnnouncementSchema } from '@/shared/schemas';

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  announcement: Announcement | null;
}>;

export const createAnnouncementAction = async (
  formData: FormData,
  userRole: string[] | null,
): ResponseCreateAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
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

  const announcementVerified = createAnnouncementSchema.safeParse(rawData);

  if (!announcementVerified.success) {
    return {
      ok: false,
      message: announcementVerified.error.issues[0].message,
      announcement: null,
    };
  }

  const { image, ...data } = announcementVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image!, 'sponsors');
    if (!cloudinaryResponse) {
      return {
        ok: false,
        message: '¡ No se pudo subir la imagen al servidor !',
        announcement: null,
      };
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdAnnouncement = await transaction.announcement.create({
        data,
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
        message: '¡ Error al crear el patrocinador, revise los logs del servidor !',
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
