'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage, deleteImage } from "@/shared/actions";
import { editPlayerSchema } from '@//shared/schemas';
import { Player } from '@/shared/interfaces';

type Options = {
  formData: FormData;
  playerId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  player: Player | null;
}>;

export const updatePlayerAction = async ({
  formData,
  playerId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      player: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      player: null,
    };
  }

  const imageFile = formData.get('image');

  const rawData = {
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') as string ?? undefined,
    birthday: new Date(formData.get('birthday') as string) ?? undefined,
    nationality: formData.get('nationality') ?? undefined,
    image: imageFile,
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const playerVerified = editPlayerSchema.safeParse(rawData);

  if (!playerVerified.success) {
    return {
      ok: false,
      message: playerVerified.error.message,
      player: null,
    };
  }
  
  const { image, ...playerToSave } = playerVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isPlayerExists = await transaction.player.count({
          where: { id: playerId },
        });

        if (!isPlayerExists) {
          return {
            ok: false,
            message: '¡ El jugador no existe o ha sido eliminado !',
            player: null,
          };
        }

        const updatedPlayer = await transaction.player.update({
          where: { id: playerId },
          data: playerToSave,
        });

        if (image) {
          // Delete previous image from cloudinary.
          if (updatedPlayer.imagePublicID) {
            const cloudinaryResponse = await deleteImage(updatedPlayer.imagePublicID);
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
          await transaction.player.update({
            where: { id: playerId },
            data: {
              imageUrl: imageUploaded.secureUrl,
              imagePublicID: imageUploaded.publicId,
            },
          });

          // Update event object to return.
          updatedPlayer.imageUrl = imageUploaded.secureUrl;
          updatedPlayer.imagePublicID = imageUploaded.publicId;
        }

        // Revalidate Cache
        revalidatePath('/admin/jugadores');

        return {
          ok: true,
          message: '¡ El jugador fue actualizado correctamente 👍 !',
          player: updatedPlayer,
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              player: null,
            };
          }
          console.log(error.message);
          return {
            ok: false,
            message: '¡ Error al actualizar el jugador, revise los logs del servidor !',
            player: null,
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          player: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      player: null,
    };
  }
};
