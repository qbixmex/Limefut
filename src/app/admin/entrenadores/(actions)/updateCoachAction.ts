'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage, deleteImage } from "@/shared/actions";
import { editCoachSchema } from '@//shared/schemas';
import { Coach } from '@/shared/interfaces';

type Options = {
  formData: FormData;
  coachId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  coach: Coach | null;
}>;

export const updateCoachAction = async ({
  formData,
  coachId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      coach: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      coach: null,
    };
  }

  const imageFile = formData.get('image');

  const rawData = {
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') as string ?? undefined,
    age: parseInt(formData.get('age') as string) ?? 0,
    nationality: formData.get('nationality') ?? undefined,
    description: formData.get('description') ?? undefined,
    image: imageFile,
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
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
            message: '¡ El entrenador no existe o ha sido eliminado !',
            coach: null,
          };
        }

        const updatedCoach = await transaction.coach.update({
          where: { id: coachId },
          data: coachToSave,
        });

        if (image) {
          // Delete previous image from cloudinary.
          if (updatedCoach.imagePublicID) {
            const cloudinaryResponse = await deleteImage(updatedCoach.imagePublicID);
            if (!cloudinaryResponse.ok) {
              throw new Error('¡ Error al intentar eliminar la imagen de cloudinary !');
            }
          }

          // Upload Image to third-party storage (cloudinary).
          const imageUploaded = await uploadImage(image as File, 'coaches');

          if (!imageUploaded) {
            throw new Error('¡ Error al intentar subir la imagen a cloudinary !');
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


        // Revalidate Cache
        revalidatePath('/admin/entrenadores');

        return {
          ok: true,
          message: '¡ El entrenador fue actualizado correctamente 👍 !',
          coach: updatedCoach,
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              coach: null,
            };
          }
          console.log(error.message);
          return {
            ok: false,
            message: '¡ Error al actualizar el entrenador, revise los logs del servidor !',
            coach: null,
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          coach: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      coach: null,
    };
  }
};
