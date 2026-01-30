'use server';

import prisma from '@/lib/prisma';
import type { Page } from '@/shared/interfaces';

type Image = {
  id: string;
  imageUrl: string;
  publicId: string;
};

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  page: Page & { images: Image[] } | null;
}>;

export const fetchPageAction = async (
  userRoles: string[],
  pageId: string,
): FetchResponse => {
  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      page: null,
    };
  }

  try {
    const page = await prisma.customPage.findFirst({
      where: { id: pageId },
      include: {
        images: {
          select: {
            id: true,
            imageUrl: true,
            publicId: true,
          },
        },
      },
    });

    if (!page) {
      return {
        ok: false,
        message: '¡ Página no encontrada ❌ !',
        page: null,
      };
    }

    return {
      ok: true,
      message: '¡ Página obtenida correctamente 👍 !',
      page,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener la página,\n¡ Revise los logs del servidor !",
        page: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      page: null,
    };
  }
};
