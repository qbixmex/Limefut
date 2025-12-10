'use server';

import prisma from '@/lib/prisma';
import { revalidatePath, updateTag } from 'next/cache';
import { editGalleryImageSchema } from '~/src/shared/schemas';
import type { GalleryImage } from '@/shared/interfaces';
import { deleteImage, uploadImage } from '~/src/shared/actions';

type Options = {
  formData: FormData;
  userRoles: string[];
  authenticatedUserId: string;
  galleryImageId: string;
};

type UpdateResponseAction = Promise<{
  ok: boolean;
  message: string;
  galleryImage: GalleryImage | null;
}>;

export const updateGalleryImageAction = async ({
  formData,
  userRoles,
  authenticatedUserId,
  galleryImageId,
}: Options): UpdateResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      galleryImage: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      galleryImage: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string,
    permalink: formData.get('permalink') ?? '',
    image: formData.get('image') as File,
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const galleryVerified = editGalleryImageSchema.safeParse(rawData);

  if (!galleryVerified.success) {
    return {
      ok: false,
      message: galleryVerified.error.message,
      galleryImage: null,
    };
  }

  const { image, ...data } = galleryVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isGalleryImageExists = await transaction.galleryImage.count({
          where: { id: galleryImageId },
        });

        if (!isGalleryImageExists) {
          return {
            ok: false,
            message: '¡ La imagen de la galería no existe o ha sido eliminada !',
            galleryImage: null,
          };
        }

        const updatedGalleryImage = await transaction.galleryImage.update({
          where: { id: galleryImageId },
          data: {
            title: data.title,
            permalink: data.permalink,
            active: data.active,
          },
        });

        // Update Image
        if (image !== null) {
          // Delete previous image from cloudinary.
          if (updatedGalleryImage.imagePublicID) {
            const cloudinaryResponse = await deleteImage(updatedGalleryImage.imagePublicID);
            if (!cloudinaryResponse.ok) {
              throw new Error('¡ Error al intentar eliminar la imagen de cloudinary !');
            }
          }

          // Upload Image to third-party storage (cloudinary).
          const imageUploaded = await uploadImage(image as File, 'teams');

          if (!imageUploaded) {
            throw new Error('¡ Error al intentar subir la imagen a cloudinary !');
          }

          // Update image data to database.
          await transaction.galleryImage.update({
            where: { id: galleryImageId },
            data: {
              imageUrl: imageUploaded.secureUrl,
              imagePublicID: imageUploaded.publicId,
            },
          });

          // Update event object to return.
          updatedGalleryImage.imageUrl = imageUploaded.secureUrl;
          updatedGalleryImage.imagePublicID = imageUploaded.publicId;
        }

        // Update Cache
        revalidatePath('/admin/galerias');
        revalidatePath(`/admin/galerias/`);
        updateTag('public-galleries');
        updateTag('public-gallery');

        return {
          ok: true,
          message: '¡ La imagen de la galería fue actualizada correctamente 👍 !',
          galleryImage: updatedGalleryImage,
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              galleryImage: null,
            };
          }

          console.log("Error Name:", error.name);
          console.log("Error Message:", error.message);

          return {
            ok: false,
            message: '¡ Error al actualizar la imagen de la galería, revise los logs del servidor !',
            galleryImage: null,
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          galleryImage: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log("Error Name:", (error as Error).name);
    console.log("Cause:", (error as Error).cause);
    console.log("Error Message:", (error as Error).message);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      galleryImage: null,
    };
  }
};
