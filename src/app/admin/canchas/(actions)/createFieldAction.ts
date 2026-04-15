'use server';

import prisma from '@/lib/prisma';
import { createFieldSchema } from '@/shared/schemas';
import { updateTag } from 'next/cache';
import type { Field } from '@/shared/interfaces';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  field: Field | null;
}>;

export const createFieldAction = async (
  formData: FormData,
  userRole: string[] | null,
): CreateResponseAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      field: null,
    };
  }

  const rawData = {
    name: formData.get('name') as string,
    permalink: formData.get('permalink') ?? '',
    city: formData.get('city') ?? undefined,
    state: formData.get('state') ?? undefined,
    country: formData.get('country') ?? undefined,
    address: formData.get('address') ?? undefined,
    map: formData.get('map') ?? undefined,
  };
  const fieldVerified = createFieldSchema.safeParse(rawData);

  if (!fieldVerified.success) {
    return {
      ok: false,
      message: fieldVerified.error.message,
      field: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdField = await transaction.field.create({
        data: fieldVerified.data,
      });

      return {
        ok: true,
        message: '¡ La cancha has sido creada satisfactoriamente 👍 !',
        field: createdField,
      };
    });

    // Update Cache
    updateTag('admin-fields');
    updateTag('admin-field');
    updateTag('public-fields');
    updateTag('public-field');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          field: null,
        };
      }

      return {
        ok: false,
        message: '¡ Error al crear la cancha, revise los logs del servidor !',
        field: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      field: null,
    };
  }
};
