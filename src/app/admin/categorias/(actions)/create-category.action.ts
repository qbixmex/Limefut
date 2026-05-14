'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import type { Category } from '@/shared/interfaces';
import { createCategorySchema } from '@/shared/schemas';
import { updateTag } from 'next/cache';

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  category: Category | null;
}>;

export const createCategoryAction = async (
  formData: FormData,
  userRole: string[] | null,
): ResponseCreateAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      category: null,
    };
  }

  const rawData = {
    name: formData.get('name') as string,
    permalink: formData.get('permalink') ?? '',
  };

  const categoryVerified = createCategorySchema.safeParse(rawData);

  if (!categoryVerified.success) {
    return {
      ok: false,
      message: categoryVerified.error.issues[0].message,
      category: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const categoryPermalinkExists = await transaction.field.count({
        where: {
          permalink: categoryVerified.data.permalink,
        },
      });

      if (categoryPermalinkExists > 0) {
        return {
          ok: false,
          message: '¡ El enlace permanente ya existe, elija otro !',
          category: null,
        };
      }

      const createdCategory = await transaction.category.create({
        data: categoryVerified.data,
      });

      return {
        ok: true,
        message: '¡ Categoría creada satisfactoriamente 👍 !',
        category: createdCategory,
      };
    });

    // Refresh Cache
    updateTag('admin-categories');

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
};
