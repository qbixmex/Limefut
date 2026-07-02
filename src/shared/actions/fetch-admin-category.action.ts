'use server';

import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  category: { id: string } | null;
}>;

export const fetchAdminCategoryAction = async (
  categoryPermalink: string | undefined,
): FetchResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('categoryId');

  try {
    const category = await prisma.category.findFirst({
      where: {
        permalink: categoryPermalink,
      },
      select: { id: true },
    });

    if (!category) {
      return {
        ok: false,
        message: `¡ La catego´ria con el enlace permanente: "${categoryPermalink}" no existe ❌ !`,
        category: null,
      };
    }

    return {
      ok: true,
      message: '¡ Categoría obtenida correctamente 👍 !',
      category: { id: category.id },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR NAME:', error.name);
      console.log('ERROR CAUSE:', error.cause);
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
