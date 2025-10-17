'use server';

import prisma from "@/lib/prisma";
import { createPlayerSchema } from "@/shared/schemas";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/shared/actions";
import { CloudinaryResponse } from "@/shared/interfaces";
import type { Player } from "@/shared/interfaces";

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  player: Player | null;
}>;

export const createPlayerAction = async (
  formData: FormData,
  userRole: string[] | null,
): CreateResponseAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      player: null,
    };
  }

  const rawData = {
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') as string ?? undefined,
    nationality: formData.get('nationality') ?? undefined,
    birthday: new Date(formData.get('birthday') as string) ?? undefined,
    image: formData.get('image') as File,
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const playerVerified = createPlayerSchema.safeParse(rawData);

  if (!playerVerified.success) {
    return {
      ok: false,
      message: playerVerified.error.message,
      player: null,
    };
  }

  const { image, ...playerToSave } = playerVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image!, 'players');
    if (!cloudinaryResponse) {
      throw new Error('Error subiendo imagen a cloudinary');
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdPlayer = await transaction.player.create({
        data: {
          ...playerToSave,
          imageUrl: cloudinaryResponse?.secureUrl ?? null,
          imagePublicID: cloudinaryResponse?.publicId ?? null,
        }
      });

      return {
        ok: true,
        message: '¡ Jugador creado correctamente 👍 !',
        player: createdPlayer,
      };
    });

    // Revalidate Paths
    revalidatePath('/admin/jugadores');

    return prismaTransaction;
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

      return {
        ok: false,
        message: '¡ Error al crear el jugador, revise los logs del servidor !',
        player: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      player: null,
    };
  }
};
