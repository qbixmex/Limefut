'use server';

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/shared/actions";
import type { CloudinaryResponse, HeroBanner } from "@/shared/interfaces";
import type { ALIGNMENT_TYPE } from "@/shared/enums";
import { createHeroBannerSchema } from "@/shared/schemas";

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  heroBanner: HeroBanner | null;
}>;

export const createHeroBannerAction = async (
  formData: FormData,
  userRole: string[] | null,
): ResponseCreateAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      heroBanner: null,
    };
  }

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    image: formData.get('image') as File,
    dataAlignment: formData.get('dataAlignment'),
    showData: (formData.get('showData') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
    position: Number(formData.get('position') ?? 0),
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const heroBannerVerified = createHeroBannerSchema.safeParse(rawData);

  if (!heroBannerVerified.success) {
    return {
      ok: false,
      message: heroBannerVerified.error.issues[0].message,
      heroBanner: null,
    };
  }

  const { image, ...data } = heroBannerVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image!, 'hero-banners');
    if (!cloudinaryResponse) {
      throw new Error('Error subiendo imagen a cloudinary');
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      // Find the maximum position
      const maxPositionResult = await transaction.heroBanner.aggregate({
        _max: { position: true },
      });

      // Calculate the new position
      const newPosition = (maxPositionResult._max.position || 0) + 1;

      const createdHeroBanner = await transaction.heroBanner.create({
        data: {
          title: data.title,
          description: data.description,
          imageUrl: cloudinaryResponse?.secureUrl as string,
          imagePublicId: cloudinaryResponse?.publicId as string,
          dataAlignment: data.dataAlignment as ALIGNMENT_TYPE ?? undefined,
          showData: data.showData ?? undefined,
          position: newPosition,
          active: data.active,
        },
      });

      return {
        ok: true,
        message: '¡ Hero banner creado satisfactoriamente 👍 !',
        heroBanner: createdHeroBanner,
      };
    });

    // Refresh Cache
    updateTag('admin-banners');
    updateTag('admin-banner');
    updateTag('public-banners');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          heroBanner: null,
        };
      }

      console.log("Name:", error.name);
      console.log("Cause:", error.cause);
      console.log("Message:", error.message);

      return {
        ok: false,
        message: '¡ Error al crear el hero banner, revise los logs del servidor !',
        heroBanner: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      heroBanner: null,
    };
  }
};
