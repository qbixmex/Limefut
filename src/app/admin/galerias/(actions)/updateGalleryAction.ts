'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { editGallerySchema } from '~/src/shared/schemas';
import type { Gallery } from '@/shared/interfaces';

type Options = {
  formData: FormData;
  userRoles: string[];
  authenticatedUserId: string | null;
  galleryId: string;
};

type UpdateResponseAction = Promise<{
  ok: boolean;
  message: string;
  gallery: Gallery | null;
}>;

export const updateGalleryAction = async ({
  formData,
  userRoles,
  authenticatedUserId,
  galleryId,
}: Options): UpdateResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      gallery: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      gallery: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string,
    permalink: formData.get('permalink') ?? '',
    galleryDate: new Date(formData.get('galleryDate') as string),
    active: formData.get('active') === 'true',
  };

  const galleryVerified = editGallerySchema.safeParse(rawData);

  if (!galleryVerified.success) {
    return {
      ok: false,
      message: galleryVerified.error.message,
      gallery: null,
    };
  }

  const galleryToSave = galleryVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isGalleryExists = await transaction.gallery.count({
          where: { id: galleryId },
        });

        if (!isGalleryExists) {
          return {
            ok: false,
            message: '¡ La galería no existe o ha sido eliminada !',
            gallery: null,
          };
        }

        const updatedGallery = await transaction.gallery.update({
          where: { id: galleryId },
          data: {
            title: galleryToSave.title,
            galleryDate: galleryToSave.galleryDate,
            active: galleryToSave.active,
          },
        });

        // Update Cache
        updateTag('admin-galleries');
        updateTag('admin-gallery');
        updateTag('dashboard-images');
        updateTag('public-gallery');
        updateTag('public-galleries');
        updateTag('public-home-images');

        return {
          ok: true,
          message: '¡ La galería fue actualizada correctamente 👍 !',
          gallery: updatedGallery,
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              gallery: null,
            };
          }

          console.log('Error Name:', error.name);
          console.log('Error Message:', error.message);

          return {
            ok: false,
            message: '¡ Error al actualizar la galería, revise los logs del servidor !',
            gallery: null,
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          gallery: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      gallery: null,
    };
  }
};
