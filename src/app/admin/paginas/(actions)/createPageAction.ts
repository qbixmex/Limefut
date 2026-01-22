'use server';

import prisma from "@/lib/prisma";
import { createPageSchema } from "@/shared/schemas";
import { revalidatePath, updateTag } from "next/cache";

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

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  page: PageType | null;
}>;

export const createPageAction = async (
  formData: FormData,
  userRole: string[] | null,
): CreateResponseAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
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

  const pageExists = await prisma.customPage.count({
    where: {
      permalink: rawData.permalink as string,
    },
  });

  if (pageExists) {
    return {
      ok: false,
      message: '¡ Ya existe una página con el "Enlace Permanente" ingresado, por favor utilice otro !',
      page: null,
    };
  }

  const pageVerified = createPageSchema.safeParse(rawData);

  if (!pageVerified.success) {
    return {
      ok: false,
      message: pageVerified.error.issues[0].message,
      page: null,
    };
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdPage = await transaction.customPage.create({
        data: pageVerified.data,
      });

      return {
        ok: true,
        message: '¡ Página creada correctamente 👍 !',
        page: createdPage,
      };
    });

    // Update Cache
    revalidatePath('/admin/paginas');
    updateTag('admin-pages');
    updateTag('public-pages');
    updateTag('public-page');

    return prismaTransaction;
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
        message: '¡ Error al crear la página, revise los logs del servidor !',
        page: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      page: null,
    };
  }
};
