'use server';

import prisma from "@/lib/prisma";
import type { Gallery } from "@/shared/interfaces";
import { createGallerySchema } from "@/shared/schemas";
import { revalidatePath, updateTag } from "next/cache";

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  gallery: Gallery | null;
}>;

export const createGalleryAction = async (
  formData: FormData,
  userRole: string[] | null,
): ResponseCreateAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      gallery: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string,
    permalink: formData.get('permalink') ?? '',
    galleryDate: new Date(formData.get('galleryDate') as string),
    tournamentId: formData.get('tournamentId') as string,
    teamId: formData.get('teamId') as string,
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const galleryVerified = createGallerySchema.safeParse(rawData);

  if (!galleryVerified.success) {
    return {
      ok: false,
      message: galleryVerified.error.message,
      gallery: null,
    };
  }

  const galleryToSave = galleryVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdGallery = await transaction.gallery.create({
        data: galleryToSave,
      });

      return {
        ok: true,
        message: '¡ Galería creada satisfactoriamente 👍 !',
        gallery: createdGallery,
      };
    });

    // Refresh Cache
    updateTag('dashboard-images');
    revalidatePath('/admin/galerias');
    updateTag("public-galleries-list");
    updateTag("public-galleries");
    updateTag("public-gallery");

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          gallery: null,
        };
      }

      return {
        ok: false,
        message: '¡ Error al crear la galería, revise los logs del servidor !',
        gallery: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      gallery: null,
    };
  }
};
