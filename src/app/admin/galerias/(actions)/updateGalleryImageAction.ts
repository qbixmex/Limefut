'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { editGalleryImageSchema } from '@/shared/schemas';
import type { GalleryImage } from '@/shared/interfaces';
import { deleteImage, uploadImage } from '@/shared/actions';

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
    image: formData.get('image') as File,
    position: Number(formData.get('position')),
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

        const galleryImages = await transaction.galleryImage.findMany({
          select: {
            id: true,
            position: true,
          },
          orderBy: { position: 'asc' },
        });

        const maxPosition = galleryImages.length;
        const updatedPosition = Math.max(1, Math.min(rawData.position, maxPosition));
        const currentPosition = galleryImages.find((image) => image.id === galleryImageId)?.position ?? 0;

        // If position unchanged, just update the imageGallery fields (ensure position kept)
        if (updatedPosition === currentPosition) {
          const updatedGalleryImage = await transaction.galleryImage.update({
            where: { id: galleryImageId },
            data: {
              title: data.title,
              active: data.active,
            },
          });

          if (image) {
            const { imageUrl, imagePublicID } = await updateImage({
              image,
              imagePublicId: updatedGalleryImage.imagePublicID,
            });

            // Update image data to database.
            await transaction.galleryImage.update({
              where: { id: galleryImageId },
              data: { imageUrl, imagePublicID },
            });
          }

          // Update Cache
          updateTag('admin-galleries');
          updateTag('admin-gallery');
          updateTag('dashboard-images');
          updateTag('public-galleries');
          updateTag('public-gallery');

          return {
            ok: true,
            message: '¡ La imagen de la galería fue actualizada correctamente 👍 !',
            galleryImage: updatedGalleryImage,
          };
        }

        // When moving up (to a smaller number): increment affected positions,
        // update in descending order to avoid unique position conflicts.
        if (updatedPosition < currentPosition) {
          const affected = galleryImages
            .filter((image) => image.position! >= updatedPosition && image.position! < currentPosition)
            .sort((a, b) => b.position! - a.position!); // descending

          for (const image of affected) {
            await transaction.galleryImage.update({
              where: { id: image.id },
              data: { position: image.position! + 1 },
            });
          }
        } else {
          // Moving down (to a larger number): decrement affected positions,
          // update in ascending order to avoid unique position conflicts.
          const affected = galleryImages
            .filter((images) => images.position! <= updatedPosition && images.position! > currentPosition)
            .sort((a, b) => a.position! - b.position!); // ascending

          for (const image of affected) {
            await transaction.galleryImage.update({
              where: { id: image.id },
              data: { position: image.position! - 1 },
            });
          }
        }

        const updatedGalleryImage = await transaction.galleryImage.update({
          where: { id: galleryImageId },
          data: {
            title: data.title,
            active: data.active,
            position: updatedPosition,
          },
        });

        if (image) {
          const { imageUrl, imagePublicID } = await updateImage({
            image,
            imagePublicId: updatedGalleryImage.imagePublicID,
          });

          // Update image data to database.
          await transaction.galleryImage.update({
            where: { id: galleryImageId },
            data: { imageUrl, imagePublicID },
          });
        }

        // Update Cache
        updateTag('admin-galleries');
        updateTag('admin-gallery');
        updateTag('dashboard-images');
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
        console.log("Error Name:", (error as Error).name);
        console.log("Error Cause:", (error as Error).cause);
        console.log("Error Message:", (error as Error).message);
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

const updateImage = async ({
  image,
  imagePublicId,
}: {
  image: File | null | undefined,
  imagePublicId: string,
}): Promise<{
  imageUrl: string;
  imagePublicID: string;
}> => {
  // Delete previous image from cloudinary.
  if (imagePublicId) {
    const cloudinaryResponse = await deleteImage(imagePublicId);
    if (!cloudinaryResponse.ok) {
      throw new Error('¡ Error al intentar eliminar la imagen de cloudinary !');
    }
  }

  // Upload Image to third-party storage (cloudinary).
  const imageUploaded = await uploadImage(image as File, 'teams');

  if (!imageUploaded) {
    throw new Error('¡ Error al intentar subir la imagen a cloudinary !');
  }

  return {
    imageUrl: imageUploaded.secureUrl,
    imagePublicID: imageUploaded.publicId,
  };
};
