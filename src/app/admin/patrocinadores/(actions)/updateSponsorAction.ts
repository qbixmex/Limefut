'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { editSponsorSchema } from '@/shared/schemas';
import type { Sponsor } from '@/shared/interfaces';
import { deleteImage, uploadImage } from '@/shared/actions';

type Options = {
  formData: FormData;
  sponsorId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  sponsor: Sponsor | null;
}>;

export const updateSponsorAction = async ({
  formData,
  sponsorId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      sponsor: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      sponsor: null,
    };
  }

  const rawData = {
    name: formData.get('name') as string,
    url: formData.get('url') ?? undefined,
    startDate: new Date(formData.get('startDate') as string) ?? new Date(),
    endDate: new Date(formData.get('endDate') as string) ?? new Date(),
    image: formData.get('image') as File,
    clicks: parseInt(formData.get('clicks') as string ?? '0'),
    position: formData.get('position') ?? '',
    active: formData.get('active') === 'true',
  };

  const sponsorVerified = editSponsorSchema.safeParse(rawData);

  if (!sponsorVerified.success) {
    return {
      ok: false,
      message: sponsorVerified.error.issues[0].message,
      sponsor: null,
    };
  }

  const { image, ...data } = sponsorVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const sponsorExists = await transaction.sponsor.count({
          where: { id: sponsorId },
        });

        if (!sponsorExists) {
          return {
            ok: false,
            message: '¡ El patrocinador no existe o ha sido eliminado !',
            sponsor: null,
          };
        }

        const sponsorDuplicated = await transaction.sponsor.count({
          where: {
            name: sponsorVerified.data.name as string,
            id: { not: sponsorId }, // Exclude current page
          },
        });

        if (sponsorDuplicated > 0) {
          return {
            ok: false,
            message: '¡ Ya existe un patrocinador con ese nombre !',
            sponsor: null,
          };
        }

        const updatedSponsor = await transaction.sponsor.update({
          where: { id: sponsorId },
          data: {
            name: data.name,
            url: data.url,
            startDate: data.startDate,
            endDate: data.endDate,
            position: data.position,
            clicks: data.clicks,
            active: data.active,
          },
        });

        if (image !== null) {
          const updatedImage = await updateSponsorImage(
            image as File,
            updatedSponsor.imagePublicId,
          );

          // Update sponsor image data.
          await transaction.sponsor.update({
            where: { id: sponsorId },
            data: {
              imageUrl: updatedImage.imageUrl,
              imagePublicId: updatedImage.imagePublicId,
            },
          });
        }

        // Update Cache
        updateTag('admin-sponsors');
        updateTag('admin-sponsor');
        updateTag('public-sponsor');

        return {
          ok: true,
          message: '¡ El patrocinador fue actualizado correctamente 👍 !',
          sponsor: updatedSponsor,
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              sponsor: null,
            };
          }

          console.log('Name:', error.name);
          console.log('Cause:', error.cause);
          console.log('Message:', error.message);

          return {
            ok: false,
            message: '¡ Error al actualizar el patrocinador, revise los logs del servidor !',
            sponsor: null,
          };
        }
        console.log((error as Error).message);
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          sponsor: null,
        };
      }
    });

    // Update Cache
    updateTag('public-sponsors');

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      sponsor: null,
    };
  }
};

const updateSponsorImage = async (image: File, imagePublicId: string) => {
  // Delete previous image from cloudinary.
  if (imagePublicId) {
    const cloudinaryResponse = await deleteImage(imagePublicId);
    if (!cloudinaryResponse.ok) {
      throw new Error('¡ Error al intentar eliminar la imagen de cloudinary !');
    }
  }

  // Upload Image to third-party storage (cloudinary).
  const imageUploaded = await uploadImage(image as File, 'sponsors');

  if (!imageUploaded) {
    throw new Error('¡ Error al intentar subir la imagen a cloudinary !');
  }

  return {
    imageUrl: imageUploaded.secureUrl,
    imagePublicId: imageUploaded.publicId,
  };
};
