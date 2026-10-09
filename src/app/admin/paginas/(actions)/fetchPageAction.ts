'use server';

import prisma from '@/lib/prisma';
import type { PAGE_STATUS_TYPE } from '@/shared/enums/page_status.enum';
import { cacheLife, cacheTag } from 'next/cache';

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  page: CUSTOM_PAGE_TYPE | null;
}>;

export type CUSTOM_PAGE_TYPE = {
  id: string;
  title: string | null;
  permalink: string | null;
  status: PAGE_STATUS_TYPE;
  content: string | null;
  position: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoRobots: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: string;
    imageUrl: string;
    resourceId: string;
  }[];
};

export const fetchPageAction = async (
  pageId: string,
): FetchResponse => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-page');

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
        message: 'Página no encontrada',
        page: null,
      };
    }

    return {
      ok: true,
      message: 'Página obtenida correctamente',
      page: {
        ...page,
        images: page.images.map((item) => ({
          id: item.id,
          imageUrl: item.imageUrl,
          resourceId: item.publicId,
        })),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener la página,\nRevise los logs del servidor',
        page: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\nRevise los logs del servidor',
      page: null,
    };
  }
};
