'use server';

import prisma from "@/lib/prisma";
import { createCoachSchema } from "@/shared/schemas";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/shared/actions";
import { CloudinaryResponse } from "@/shared/interfaces";
import type { Coach } from "@/shared/interfaces";

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  coach: Coach & {
    teams: { id: string; name: string; }[]
  } | null;
}>;

export const createCoachAction = async (
  formData: FormData,
  userRole: string[] | null,
): CreateResponseAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      coach: null,
    };
  }

  const rawData = {
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') as string ?? undefined,
    age: parseInt(formData.get('age') as string) ?? 0,
    nationality: formData.get('nationality') ?? undefined,
    description: formData.get('description') ?? undefined,
    image: formData.get('image') as File,
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
    teamsIds: formData.get('teamsIds')
      ? JSON.parse(formData.get('teamsIds') as string)
      : [],
  };

  const coachVerified = createCoachSchema.safeParse(rawData);

  if (!coachVerified.success) {
    return {
      ok: false,
      message: coachVerified.error.message,
      coach: null,
    };
  }

  const { image, teamsIds, ...coachToSave } = coachVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image!, 'coaches');
    if (!cloudinaryResponse) {
      throw new Error('Error subiendo imagen a cloudinary');
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdCoach = await transaction.coach.create({
        data: {
          ...coachToSave,
          imageUrl: cloudinaryResponse?.secureUrl ?? null,
          imagePublicID: cloudinaryResponse?.publicId ?? null,
          teams: {
            connect: (teamsIds ?? []).map((id: string) => ({ id })),
          },
        },
        include: {
          teams: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        ok: true,
        message: '¡ Entrenador creado correctamente 👍 !',
        coach: createdCoach,
      };
    });

    // Revalidate Paths
    revalidatePath('/admin/entrenadores');

    return prismaTransaction;
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
      console.log("CAUSE:", error.cause);
      console.log("META:", error.meta);
      console.log("MESSAGE:", error.message);
      return {
        ok: false,
        message: '¡ Error al crear el entrenador, revise los logs del servidor !',
        coach: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      coach: null,
    };
  }
};
