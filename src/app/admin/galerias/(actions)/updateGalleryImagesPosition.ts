'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

type Options = {
  newPosition: number;
  userRoles: string[];
  authenticatedUserId: string;
  galleryId: string;
  galleryImageId: string;
};

type UpdateResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateGalleryImagesPositionAction = async ({
  newPosition,
  userRoles,
  authenticatedUserId,
  galleryImageId,
  galleryId,
}: Options): UpdateResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const images = await transaction.galleryImage.findMany({
          where: {
            galleryId,
          },
          select: {
            id: true,
            position: true,
          },
          orderBy: {
            position: 'asc',
          },
        });

        const target = images.find((item) => item.id === galleryImageId);

        if (!target) {
          return {
            ok: false,
            message: '¡ Imagen no encontrada en la galería !',
          };
        }

        const maxPosition = images.length;
        const updatedPosition = Math.max(1, Math.min(newPosition, maxPosition));
        const currentPosition = target.position;

        if (updatedPosition === currentPosition) {
          // Nothing to do
          return {
            ok: true,
            message: '¡ La posición ya es la indicada !',
          };
        }

        // When moving up (to a smaller number): increment affected positions,
        // update in descending order to avoid unique position conflicts.
        if (updatedPosition < currentPosition) {
          const affected = images
            .filter((img) => img.position >= updatedPosition && img.position < currentPosition)
            .sort((a, b) => b.position - a.position); // descending

          for (const img of affected) {
            await transaction.galleryImage.update({
              where: { id: img.id },
              data: { position: img.position + 1 },
            });
          }
        } else {
          // Moving down (to a larger number): decrement affected positions,
          // update in ascending order to avoid unique position conflicts.
          const affected = images
            .filter((img) => img.position <= updatedPosition && img.position > currentPosition)
            .sort((a, b) => a.position - b.position); // ascending

          for (const img of affected) {
            await transaction.galleryImage.update({
              where: { id: img.id },
              data: { position: img.position - 1 },
            });
          }
        }

        await transaction.galleryImage.update({
          where: { id: galleryImageId },
          data: { position: updatedPosition },
        });

        // Update Cache
        updateTag('dashboard-images');
        updateTag('admin-galleries');
        updateTag('admin-gallery');
        updateTag('public-galleries');
        updateTag('public-gallery');

        return {
          ok: true,
          message: '¡ La imagen de la galería fue actualizada correctamente 👍 !',
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
            };
          }

          console.log("Error Name:", error.name);
          console.log("Error Message:", error.message);

          return {
            ok: false,
            message: '¡ Error al actualizar las imágenes de la galería, revise los logs del servidor !',
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
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
    };
  }
};
