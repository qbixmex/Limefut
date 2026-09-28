'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { uploadImage, deleteImage } from '@/shared/actions';
import { editCoachSchema } from '@/shared/schemas';
import type { Coach } from '@/shared/interfaces';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

type Options = {
  formData: FormData;
  coachId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  coach: Coach | null;
}>;

export const updateCoachAction = async ({
  formData,
  coachId,
}: Options): EditResponseAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
      coach: null,
    };
  }

  const imageFile = formData.get('image');

  const rawData = {
    name: formData.get('name') ?? undefined,
    email: formData.get('email') ?? undefined,
    phone: formData.get('phone') as string ?? undefined,
    age: formData.get('age') ? Number(formData.get('age')) : undefined,
    nationality: formData.get('nationality') ?? undefined,
    description: formData.get('description') ?? undefined,
    image: imageFile,
    active: formData.get('active') === 'true',
    teamsIds: formData.get('teamsIds')
      ? JSON.parse(formData.get('teamsIds') as string)
      : [],
  };

  const coachVerified = editCoachSchema.safeParse(rawData);

  if (!coachVerified.success) {
    return {
      ok: false,
      message: coachVerified.error.message,
      coach: null,
    };
  }

  const { image, ...coachToSave } = coachVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isCoachExists = await transaction.coach.count({
          where: { id: coachId },
        });

        if (!isCoachExists) {
          return {
            ok: false,
            message: 'El entrenador no existe o ha sido eliminado',
            coach: null,
          };
        }

        const updatedCoach = await transaction.coach.update({
          where: { id: coachId },
          data: coachToSave,
        });

        if (image) {
          // Delete previous image from cloudinary if exists.
          if (updatedCoach.imagePublicID) {
            const cloudinaryResponse = await deleteImage(updatedCoach.imagePublicID);
            if (!cloudinaryResponse.ok) {
              throw new Error('Error al intentar eliminar la imagen de cloudinary');
            }
          }

          // Upload Image to third-party storage (cloudinary).
          const imageUploaded = await uploadImage(image as File, 'coaches');

          if (!imageUploaded) {
            throw new Error('Error al intentar subir la imagen a cloudinary');
          }

          // Update image data to database.
          await transaction.coach.update({
            where: { id: coachId },
            data: {
              imageUrl: imageUploaded.secureUrl,
              imagePublicID: imageUploaded.publicId,
            },
          });

          // Update event object to return.
          updatedCoach.imageUrl = imageUploaded.secureUrl;
          updatedCoach.imagePublicID = imageUploaded.publicId;
        }

        // Update Cache
        updateTag('admin-coaches');
        updateTag('admin-coach');
        updateTag('admin-coaches-for-team');

        return {
          ok: true,
          message: 'El entrenador fue actualizado correctamente',
          coach: updatedCoach,
        };
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
              coach: null,
            };
          }

          console.log(error);

          return {
            ok: false,
            message: 'Error al actualizar el entrenador, revise los logs del servidor',
            coach: null,
          };
        }
        console.log(error);
        return {
          ok: false,
          message: 'Error inesperado, revise los logs del servidor',
          coach: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado, revise los logs del servidor',
      coach: null,
    };
  }
};
