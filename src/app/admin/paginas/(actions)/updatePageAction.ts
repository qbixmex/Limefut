'use server';

import prisma from '@/lib/prisma';
import { revalidatePath, updateTag } from 'next/cache';
import { editPageSchema } from '@/shared/schemas';
import type { Page, PAGE_STATUS } from '@/shared/interfaces';

type Options = {
  formData: FormData;
  pageId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  page: Page | null;
}>;

export const updatePageAction = async ({
  formData,
  pageId,
}: Options): EditResponseAction => {
  const rawData = {
    title: formData.get('title') as string,
    permalink: formData.get('permalink') ?? '',
    content: formData.get('content') ?? '',
    seoTitle: formData.get('seoTitle') ?? '',
    status: formData.get('status') ?? 'draft',
    seoDescription: formData.get('seoDescription') ?? '',
    seoRobots: formData.get('seoRobots') ?? '',
    position: Number(formData.get('position') ?? 0),
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

        const isPageDuplicated = await transaction.customPage.count({
          where: {
            permalink: pageVerified.data.permalink as string,
            id: { not: pageId }, // Exclude current page 
          },
        });

        if (isPageDuplicated > 0) {
          return {
            ok: false,
            message: '¡ Ya existe ese enlace permanente !',
            page: null,
          };
        }

        const pages = await transaction.customPage.findMany({
          select: {
            id: true,
            position: true,
          },
          orderBy: {
            position: 'asc',
          },
        });

        const maxPosition = pages.length;
        const updatedPosition = Math.max(1, Math.min(rawData.position, maxPosition));
        const currentPosition = pages.find((page) => page.id === pageId)?.position ?? 0;

        // If position unchanged, just update the page fields (ensure position kept)
        if (updatedPosition === currentPosition) {
          const updatedPage = await transaction.customPage.update({
            where: { id: pageId },
            data: {
              ...pageVerified.data,
              position: updatedPosition,
              status: pageVerified.data.status as PAGE_STATUS,
            },
          });

          // Update Cache
          revalidatePath('/admin/paginas');
          updateTag('admin-pages');
          updateTag('public-page-links');
          updateTag(`public-page-${updatedPage.permalink}`);
          updateTag(`public-page-metadata-${updatedPage.permalink}`);

          return {
            ok: true,
            message: '¡ La página fue guardada correctamente 👍 !',
            page: updatedPage,
          };
        }

        // When moving up (to a smaller number): increment affected positions,
        // update in descending order to avoid unique position conflicts.
        if (updatedPosition < currentPosition) {
          const affected = pages
            .filter((p) => p.position! >= updatedPosition && p.position! < currentPosition)
            .sort((a, b) => b.position! - a.position!); // descending

          for (const p of affected) {
            await transaction.customPage.update({
              where: { id: p.id },
              data: { position: p.position! + 1 },
            });
          }
        } else {
          // Moving down (to a larger number): decrement affected positions,
          // update in ascending order to avoid unique position conflicts.
          const affected = pages
            .filter((p) => p.position! <= updatedPosition && p.position! > currentPosition)
            .sort((a, b) => a.position! - b.position!); // ascending

          for (const p of affected) {
            await transaction.customPage.update({
              where: { id: p.id },
              data: { position: p.position! - 1 },
            });
          }
        }

        const updatedPage = await transaction.customPage.update({
          where: { id: pageId },
          data: {
            ...pageVerified.data,
            position: updatedPosition,
            status: pageVerified.data.status as PAGE_STATUS,
          },
        });

        // Update Cache
        revalidatePath('/admin/paginas');
        updateTag('admin-pages');
        updateTag('public-page-links');
        updateTag(`public-page-${updatedPage.permalink}`);
        updateTag(`public-page-metadata-${updatedPage.permalink}`);

        return {
          ok: true,
          message: '¡ La página fue guardada correctamente 👍 !',
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
            message: '¡ Error al guardar la página, revise los logs del servidor !',
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
