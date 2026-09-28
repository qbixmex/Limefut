'use server';

import prisma from '@/lib/prisma';
import { createCoachSchema } from '@/shared/schemas';
import { updateTag } from 'next/cache';
import { uploadImage } from '@/shared/actions';
import type { CloudinaryResponse, Coach } from '@/shared/interfaces';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  coach: Coach & {
    teams: { id: string; name: string; }[]
  } | null;
}>;

export const createCoachAction = async (
  formData: FormData,
): CreateResponseAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return {
      ok: false,
      message: guard.message,
      coach: null,
    };
  }

  const rawData = {
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') as string ?? undefined,
    age: formData.get('age') ? Number(formData.get('age')) : undefined,
    nationality: formData.get('nationality') ?? undefined,
    description: formData.get('description') ?? undefined,
    image: formData.get('image') as File,
    active: formData.get('active') === 'true',
  };

  const coachVerified = createCoachSchema.safeParse(rawData);

  if (!coachVerified.success) {
    return {
      ok: false,
      message: coachVerified.error.message,
      coach: null,
    };
  }

  const isEmailUnique = await prisma.coach.count({
    where: { email: coachVerified.data.email },
  });

  if (isEmailUnique > 0) {
    return {
      ok: false,
      message: 'El correo electrónico ya existe, elija otro',
      coach: null,
    };
  }

  const { image, ...coachToSave } = coachVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdCoach = await transaction.coach.create({
        data: coachToSave,
        include: {
          teams: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (createdCoach) {
        // Upload Image to third-party storage (cloudinary).
        let cloudinaryResponse: CloudinaryResponse | null = null;

        if (image) {
          cloudinaryResponse = await uploadImage(image!, 'coaches');
          if (!cloudinaryResponse) {
            throw new Error('Error subiendo imagen a cloudinary');
          }
        }

        const updatedCoach = await transaction.coach.update({
          where: { id: createdCoach.id },
          data: {
            imageUrl: cloudinaryResponse?.secureUrl ?? null,
            imagePublicID: cloudinaryResponse?.publicId ?? null,
          },
          select: {
            imageUrl: true,
            imagePublicID: true,
          },
        });

        // Update coach image properties
        createdCoach.imageUrl = updatedCoach.imageUrl;
        createdCoach.imagePublicID = updatedCoach.imagePublicID;
      }

      return {
        ok: true,
        message: 'Entrenador creado correctamente',
        coach: createdCoach,
      };
    });

    // Update Cache
    updateTag('admin-coaches');
    updateTag('admin-coach');
    updateTag('admin-coaches-for-team');

    return prismaTransaction;
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
        message: 'Error al crear el entrenador, revise los logs del servidor',
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
};
