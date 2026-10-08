'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/get-session';
import { Prisma } from '@/generated/prisma/client';

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  pageId: string | null;
}>;

export const createEmptyCustomPage = async (): CreateResponseAction => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return { ok: false, message: guard.message, pageId: null };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      // Find the maximum position
      const maxPositionResult = await transaction.customPage.aggregate({
        _max: { position: true },
      });

      // Calculate the new position
      const newPosition = (maxPositionResult._max.position || 0) + 1;

      // Create the new empty page
      const newPage = await transaction.customPage.create({
        data: { position: newPosition },
        select: { id: true },
      });

      return {
        ok: true,
        message: 'Borrador creado correctamente',
        pageId: newPage.id,
      };
    });

    // Update Cache
    updateTag('admin-pages');
    updateTag('admin-page');
    updateTag('public-page-links');

    return prismaTransaction;
  } catch (error) {
    let errorMessage = 'Error inesperado';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('Error Name:', error.name);
      console.log('Error Code:', error.code);
      console.log('Error cause:', error.cause ?? 'none');
      console.log('Error Metadata:', error.meta ?? 'none');
      console.log('Error Message:', error.message);

      if (error.code === 'P2001') {
        errorMessage = 'No se encontró la página personalizada';
      }

      if (error.code === 'P2002') {
        errorMessage = 'Hay campos duplicados';
      }
    }

    if (error instanceof Error) {
      console.log('Error Name:', error.name);
      console.log('Error Message:', error.message);
      console.log('Error Cause:', error.cause ?? 'none');
      console.log('Error Stack:', error.stack ?? 'none');

      errorMessage = 'No se pudo actualizar la página personalizada';
    }

    return {
      ok: false,
      message: `${errorMessage}, revise los logs del servidor`,
      pageId: null,
    };
  }
};
