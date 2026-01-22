'use server';

import prisma from '@/lib/prisma';
import { revalidatePath, updateTag } from 'next/cache';
import { editPageSchema } from '@/root/src/shared/schemas';

export type PageType = {
  id: string;
  title: string;
  permalink: string;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoRobots: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Options = {
  formData: FormData;
  pageId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  page: PageType | null;
}>;

export const updatePageAction = async ({
  formData,
  pageId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      page: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      page: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string,
    permalink: formData.get('permalink') ?? '',
    content: formData.get('content') ?? '',
    seoTitle: formData.get('seoTitle') ?? '',
    seoDescription: formData.get('seoDescription') ?? '',
    seoRobots: formData.get('seoRobots') ?? '',
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const pageVerified = editPageSchema.safeParse(rawData);

  if (!pageVerified.success) {
    return {
      ok: false,
      message: pageVerified.error.message,
      page: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isPageExists = await transaction.customPage.count({
          where: { id: pageId },
        });

        if (!isPageExists) {
          return {
            ok: false,
            message: '¡ La página no existe o ha sido eliminada !',
            page: null,
          };
        }

        const updatedPage = await transaction.customPage.update({
          where: { id: pageId },
          data: pageVerified.data,
        });

        // Update Cache
        revalidatePath('/admin/paginas');
        updateTag('admin-pages');
        updateTag('public-page');
        updateTag('public-pages');

        return {
          ok: true,
          message: '¡ La página fue actualizada correctamente 👍 !',
          page: updatedPage,
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              page: null,
            };
          }

          return {
            ok: false,
            message: '¡ Error al actualizar la página, revise los logs del servidor !',
            page: null,
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          page: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      page: null,
    };
  }
};
