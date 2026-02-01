'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { editHeroBannerSchema } from '@/shared/schemas';
import type { ALIGNMENT, CloudinaryResponse, HeroBanner } from '@/shared/interfaces';
import { deleteImage, uploadImage } from '@/shared/actions';

type Options = {
  formData: FormData;
  heroBannerId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  heroBanner: HeroBanner | null;
}>;

export const updateHeroBannerAction = async ({
  formData,
  heroBannerId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      heroBanner: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      heroBanner: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    image: formData.get('image') as File,
    dataAlignment: formData.get('dataAlignment'),
    showData: (formData.get('showData') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
    position: Number(formData.get('position') ?? 0),
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const heroBannerVerified = editHeroBannerSchema.safeParse(rawData);

  if (!heroBannerVerified.success) {
    return {
      ok: false,
      message: heroBannerVerified.error.issues[0].message,
      heroBanner: null,
    };
  }

  const { image, ...data } = heroBannerVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image!, 'teams');
    if (!cloudinaryResponse) {
      throw new Error('Error subiendo imagen a cloudinary');
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const heroBannerExists = await transaction.heroBanner.count({
          where: { id: heroBannerId },
        });

        if (!heroBannerExists) {
          return {
            ok: false,
            message: '¡ El banner no existe o ha sido eliminado !',
            heroBanner: null,
          };
        }

        const heroBannerDuplicated = await transaction.heroBanner.count({
          where: {
            title: heroBannerVerified.data.title as string,
            id: { not: heroBannerId }, // Exclude current page 
          },
        });

        if (heroBannerDuplicated > 0) {
          return {
            ok: false,
            message: '¡ Ya existe ese título !',
            heroBanner: null,
          };
        }

        const heroBanners = await transaction.heroBanner.findMany({
          select: {
            id: true,
            position: true,
          },
          orderBy: { position: 'asc' },
        });

        const maxPosition = heroBanners.length;
        const updatedPosition = Math.max(1, Math.min(rawData.position, maxPosition));
        const currentPosition = heroBanners.find((banner) => banner.id === heroBannerId)?.position ?? 0;

        // If position unchanged, just update the page fields (ensure position kept)
        if (updatedPosition === currentPosition) {
          const updatedPage = await transaction.heroBanner.update({
            where: { id: heroBannerId },
            data: {
              title: data.title,
              description: data.description,
              dataAlignment: data.dataAlignment as ALIGNMENT ?? undefined,
              showData: data.showData ?? undefined,
              position: updatedPosition,
              active: data.active,
            },
          });

          // Update Cache
          revalidatePath('/admin/banners');
          revalidatePath(`/admin/banners/${heroBannerId}`);

          return {
            ok: true,
            message: '¡ El banner fue guardado correctamente 👍 !',
            heroBanner: updatedPage,
          };
        }

        // When moving up (to a smaller number): increment affected positions,
        // update in descending order to avoid unique position conflicts.
        if (updatedPosition < currentPosition) {
          const affected = heroBanners
            .filter((banner) => banner.position! >= updatedPosition && banner.position! < currentPosition)
            .sort((a, b) => b.position! - a.position!); // descending

          for (const banner of affected) {
            await transaction.heroBanner.update({
              where: { id: banner.id },
              data: { position: banner.position! + 1 },
            });
          }
        } else {
          // Moving down (to a larger number): decrement affected positions,
          // update in ascending order to avoid unique position conflicts.
          const affected = heroBanners
            .filter((banner) => banner.position! <= updatedPosition && banner.position! > currentPosition)
            .sort((a, b) => a.position! - b.position!); // ascending

          for (const banner of affected) {
            await transaction.heroBanner.update({
              where: { id: banner.id },
              data: { position: banner.position! - 1 },
            });
          }
        }

        const updatedHeroBanner = await transaction.heroBanner.update({
          where: { id: heroBannerId },
          data: {
            title: data.title,
            description: data.description,
            dataAlignment: data.dataAlignment as ALIGNMENT ?? undefined,
            showData: data.showData ?? undefined,
            position: updatedPosition,
            active: data.active,
          },
        });

        if (image !== null) {
          // Delete previous image from cloudinary.
          if (updatedHeroBanner.imagePublicId) {
            const cloudinaryResponse = await deleteImage(updatedHeroBanner.imagePublicId);
            if (!cloudinaryResponse.ok) {
              throw new Error('¡ Error al intentar eliminar la imagen de cloudinary !');
            }
          }

          // Upload Image to third-party storage (cloudinary).
          const imageUploaded = await uploadImage(image as File, 'hero-banners');

          if (!imageUploaded) {
            throw new Error('¡ Error al intentar subir la imagen a cloudinary !');
          }

          // Update image data to database.
          await transaction.heroBanner.update({
            where: { id: heroBannerId },
            data: {
              imageUrl: imageUploaded.secureUrl,
              imagePublicId: imageUploaded.publicId,
            },
          });

          // Update event object to return.
          updatedHeroBanner.imageUrl = imageUploaded.secureUrl;
          updatedHeroBanner.imagePublicId = imageUploaded.publicId;
        }

        // Update Cache
        revalidatePath('/admin/banners');
        revalidatePath(`/admin/banners/${heroBannerId}`);

        return {
          ok: true,
          message: '¡ El banner fue actualizado correctamente 👍 !',
          heroBanner: updatedHeroBanner,
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              heroBanner: null,
            };
          }

          console.log("Name:", error.name);
          console.log("Cause:", error.cause);
          console.log("Message:", error.message);

          return {
            ok: false,
            message: '¡ Error al actualizar el banner, revise los logs del servidor !',
            heroBanner: null,
          };
        }
        console.log((error as Error).message);
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          heroBanner: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      heroBanner: null,
    };
  }
};
