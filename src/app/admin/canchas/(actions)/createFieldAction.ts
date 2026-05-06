'use server';

import prisma from '@/lib/prisma';
import { createFieldSchema } from '@/shared/schemas';
import { updateTag } from 'next/cache';
import type { Field } from '@/shared/interfaces';
import { Prisma } from '@/generated/prisma/client';

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
      const fieldPermalinkExists = await transaction.field.count({
        where: {
          permalink: fieldVerified.data.permalink,
        },
      });

      if (fieldPermalinkExists > 0) {
        return {
          ok: false,
          message: '¡ El enlace permanente ya existe, elija otro !',
          field: null,
        };
      }

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
    updateTag('admin-fields-for-team');
    updateTag('admin-field');
    updateTag('public-fields');
    updateTag('public-field');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        if (error.meta) {
          console.log('ERROR METADATA:', error.meta);
        }

        return {
          ok: false,
          message: '¡ Hay campos duplicados, revise los logs del servidor !',
          field: null,
        };
      }

      return {
        ok: false,
        message: '¡ Error al crear la cancha, revise los logs del servidor !',
        field: null,
      };
    }

    if (error instanceof Error) {
      console.log('ERROR NAME:', error.name);
      console.log('ERROR CAUSE:', error.cause);
      console.log('ERROR MESSAGE:', error.message);

      return {
        ok: false,
        message: '¡ Error al crear la cancha, revise los logs del servidor !',
        field: null,
      };
    }

    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      field: null,
    };
  }
};
