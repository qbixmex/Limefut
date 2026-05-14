'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { editTournamentSchema } from '@/shared/schemas';
import type { Category } from '@/shared/interfaces';
import { Prisma } from '@/generated/prisma/client';

type Options = {
  formData: FormData;
  categoryId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  category: Category | null;
}>;

export const updateCategoryAction = async ({
  formData,
  categoryId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      category: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      category: null,
    };
  }

  const rawData = {
    name: formData.get('name') ?? undefined,
    permalink: formData.get('permalink') ?? undefined,
  };

  const categoryVerified = editTournamentSchema.safeParse(rawData);

  if (!categoryVerified.success) {
    return {
      ok: false,
      message: categoryVerified.error.issues[0].message,
      category: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isCategoryExists = await transaction.category.count({
          where: { id: categoryId },
        });

        if (isCategoryExists === 0) {
          return {
            ok: false,
            message: '¡ La categoría no existe o ha sido eliminada !',
            category: null,
          };
        }

        const isCategoryDuplicated = await transaction.field.count({
          where: {
            permalink: categoryVerified.data.permalink,
            id: { not: categoryId }, // Exclude current id
          },
        });

        if (isCategoryDuplicated > 0) {
          return {
            ok: false,
            message: '¡ El enlace permanente ya existe, elija otro !',
            category: null,
          };
        }

        const updatedCategory = await transaction.category.update({
          where: { id: categoryId },
          data: categoryVerified.data,
        });

        // Update Cache
        updateTag('admin-categories');

        return {
          ok: true,
          message: '¡ La categoría fue actualizada correctamente 👍 !',
          category: updatedCategory,
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            if (error.meta) {
              console.log('ERROR METADATA:', error.meta);
            }

            return {
              ok: false,
              message: '¡ Hay campos duplicados, revise los logs del servidor !',
              category: null,
            };
          }

          return {
            ok: false,
            message: '¡ Error al crear la categoría, revise los logs del servidor !',
            category: null,
          };
        }
        console.log(error);
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs del servidor !',
          category: null,
        };
      }
    });

  return prismaTransaction;
} catch (error) {
  console.log(error);
  return {
    ok: false,
    message: '¡ Error inesperado, revise los logs del servidor !',
    category: null,
  };
}
};
