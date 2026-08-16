'use server';

import prisma from '@/lib/prisma';
import type { Category } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  category: Category | null;
}>;

export const fetchCategoryAction = async ({
  categoryId,
}: {
  categoryId: string;
}): FetchResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-category');

  try {
    const category = await prisma.category.findFirst({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });

    if (!category) {
      return {
        ok: false,
        message: '¡ La categoría no se encuentra en la base de datos ❌ !',
        category: null,
      };
    }

    return {
      ok: true,
      message: '¡ Categoría obtenida correctamente 👍 !',
      category,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR NAME:', error.name);
      console.log('ERROR MESSAGE:', error.message);

      return {
        ok: false,
        message: 'No se pudo obtener la categoría,\n¡ Revise los logs del servidor !',
        category: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      category: null,
    };
  }
};
