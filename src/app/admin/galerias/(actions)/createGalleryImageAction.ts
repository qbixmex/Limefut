'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import type { CloudinaryResponse, GalleryImage } from '@/shared/interfaces';
import { createGalleryImageSchema } from '@/shared/schemas';
import { updateTag } from 'next/cache';
import { uploadImage } from '~/src/shared/actions';

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

  const gallery = await prisma.gallery.findFirst({
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
    active: formData.get('active') === 'true',
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
    const createdImageGallery = await prisma.galleryImage.create({
      data: {
        title: data.title,
        imageUrl: cloudinaryResponse?.secureUrl as string,
        imagePublicID: cloudinaryResponse?.publicId as string,
        active: data.active,
        position: data.position,
        galleryId: gallery.id,
      },
    });

    // Refresh Cache
    updateTag('dashboard-images');
    updateTag('admin-galleries');
    updateTag('admin-gallery');
    updateTag('public-galleries');
    updateTag('public-gallery');
    updateTag('public-home-images');

    return {
      ok: true,
      message: '¡ La imagen su cargó correctamente 👍 !',
      galleryImage: createdImageGallery,
    };
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log('ERROR NAME:', error.name);
          console.log('ERROR CAUSE:', error.cause);
          console.log('ERROR CODE:', 'P2002');
          console.log('ERROR MESSAGE:', error.message);

          const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
          return {
            ok: false,
            message: `¡ El campo "${fieldError}", está duplicado !`,
            galleryImage: null,
          };
        }
      }

      console.log('='.repeat(40) + ' ERROR ' + '='.repeat(40));
      console.log('NAME:', error.name);
      console.log('CAUSE:', error.cause);
      console.log('CODE:', 'P2002');
      console.log('MESSAGE:', error.message);
      console.log('='.repeat(87));

      return {
        ok: false,
        message: '¡ Error al subir la imagen, revise los logs del servidor !',
        galleryImage: null,
      };
    }

    if (error instanceof Error) {
      console.log('='.repeat(40) + ' ERROR ' + '='.repeat(40));
      console.log('NAME:', error.name);
      console.log('CAUSE:', error.cause);
      console.log('MESSAGE:', error.message);
      console.log('='.repeat(87));

      return {
        ok: false,
        message: '¡ Error al subir la imagen, revise los logs del servidor !',
        galleryImage: null,
      };
    }

    console.log('='.repeat(40) + ' ERROR ' + '='.repeat(40));
    console.log(error);
    console.log('='.repeat(87));

    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      galleryImage: null,
    };
  }
};
