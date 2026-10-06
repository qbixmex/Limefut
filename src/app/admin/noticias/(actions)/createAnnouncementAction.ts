'use server';

import { updateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import type { Announcement, CloudinaryResponse } from '@/shared/interfaces';
import { CreateAnnouncementSchema } from '@/shared/schemas';
import { uploadImage } from '@/shared/actions';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  announcement: Announcement | null;
}>;

export const createAnnouncementAction = async ({
  formData,
}: {
  formData: FormData,
}): ResponseCreateAction => {
  const guard = await requireAdmin();

  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
      announcement: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string ?? '',
    permalink: formData.get('permalink') ?? '',
    publishedDate: formData.get('publishedDate') ? new Date(formData.get('publishedDate') as string) : null,
    description: formData.get('description') ?? '',
    content: formData.get('content') ?? '',
    image: formData.get('image') as File | null ?? undefined,
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

  const { image, ...announcementToSave } = announcementVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image as File, 'announcements');
    if (!cloudinaryResponse) {
      throw new Error('Error subiendo imagen a cloudinary');
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdAnnouncement = await transaction.announcement.create({
        data: {
          ...announcementToSave,
          imageUrl: cloudinaryResponse?.secureUrl ?? undefined,
          imagePublicID: cloudinaryResponse?.publicId ?? undefined,
        },
      });

      return {
        ok: true,
        message: 'Noticia creada satisfactoriamente',
        announcement: createdAnnouncement,
      };
    });

    // Refresh Cache
    updateTag('admin-announcements');
    updateTag('admin-announcement');
    updateTag('public-announcements');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        if (error.meta) {
          console.log('ERROR METADATA:', error.meta);
        }

        console.log(error);

        return {
          ok: false,
          message: 'Hay campos duplicados, revise los logs del servidor',
          announcement: null,
        };
      }

      console.log(error);

      return {
        ok: false,
        message: 'Error al crear la noticia, revise los logs del servidor',
        announcement: null,
      };
    }

    console.log(error);

    return {
      ok: false,
      message: 'Error inesperado, revise los logs del servidor',
      announcement: null,
    };
  }
};
