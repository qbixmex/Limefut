'use server';

import prisma from "@/lib/prisma";
import type { CloudinaryResponse, GalleryImage } from "@/shared/interfaces";
import { createGalleryImageSchema } from "@/shared/schemas";
import { updateTag } from "next/cache";
import { uploadImage } from "~/src/shared/actions";

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  galleryImage: GalleryImage | null;
}>;

export const createGalleryImageAction = async ({
  userRoles,
  galleryId,
  formData,
}: {
  userRoles: string[] | null,
  galleryId: string,
  formData: FormData,
}): ResponseCreateAction => {
  if ((userRoles !== null) && (!userRoles.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      galleryImage: null,
    };
  }

  const gallery = await prisma.gallery.findUnique({
    where: { id: galleryId },
    select: {
      id: true,
      permalink: true,
    },
  });

  if (!gallery) {
    return {
      ok: false,
      message: `¡ La galeria con el id "${galleryId}" no existe !`,
      galleryImage: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string,
    image: formData.get('image') as File,
    position: Number(formData.get('position')),
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const galleryVerified = createGalleryImageSchema.safeParse(rawData);

  if (!galleryVerified.success) {
    return {
      ok: false,
      message: galleryVerified.error.message,
      galleryImage: null,
    };
  }

  const { image, ...data } = galleryVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image!, 'gallery_images');
    if (!cloudinaryResponse) {
      throw new Error('Error subiendo imagen a cloudinary');
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdImageGallery = await transaction.galleryImage.create({
        data: {
          title: data.title,
          imageUrl: cloudinaryResponse?.secureUrl as string,
          imagePublicID: cloudinaryResponse?.publicId as string,
          active: data.active,
          position: data.position,
          galleryId: gallery.id,
        },
      });

      return {
        ok: true,
        message: '¡ La imagen fue subida correctamente 👍 !',
        galleryImage: createdImageGallery,
      };
    });

    // Refresh Cache
    updateTag('dashboard-images');
    updateTag('admin-galleries');
    updateTag('admin-gallery');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          galleryImage: null,
        };
      }

      return {
        ok: false,
        message: '¡ Error al subir la imagen, revise los logs del servidor !',
        galleryImage: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      galleryImage: null,
    };
  }
};
