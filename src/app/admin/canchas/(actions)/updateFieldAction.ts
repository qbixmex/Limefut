'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { editFieldSchema } from '@/shared/schemas';
import type { Field } from '@/shared/interfaces';

type Options = {
  formData: FormData;
  fieldId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  field: Field | null;
}>;

export const updateFieldAction = async ({
  formData,
  fieldId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      field: null,
    };
  }

  if (!userRoles.includes('admin')) {
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

  const fieldVerified = editFieldSchema.safeParse(rawData);

  if (!fieldVerified.success) {
    return {
      ok: false,
      message: fieldVerified.error.message,
      field: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isFieldExists = await transaction.field.count({
          where: { id: fieldId },
        });

        if (!isFieldExists) {
          return {
            ok: false,
            message: '¡ La cancha no existe o ha sido eliminada !',
            field: null,
          };
        }

        const updatedField = await transaction.field.update({
          where: { id: fieldId },
          data: fieldVerified.data,
        });

        // Update Cache
        updateTag('admin-fields');
        updateTag('admin-field');
        updateTag('public-fields');
        updateTag('public-field');

        return {
          ok: true,
          message: '¡ La cancha fue actualizada correctamente 👍 !',
          field: updatedField,
        };
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
            message: '¡ Error al actualizar la cancha, revise los logs del servidor !',
            field: null,
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          field: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      field: null,
    };
  }
};
