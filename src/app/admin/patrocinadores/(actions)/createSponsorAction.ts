'use server';

import { updateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/shared/actions';
import type { CloudinaryResponse, Sponsor } from '@/shared/interfaces';
import { createSponsorSchema } from '@/shared/schemas';

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  sponsor: Sponsor | null;
}>;

export const createSponsorAction = async (
  formData: FormData,
  userRole: string[] | null,
): ResponseCreateAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      sponsor: null,
    };
  }

  const rawData = {
    name: formData.get('name') as string,
    url: formData.get('url') ?? undefined,
    startDate: new Date(formData.get('startDate') as string) ?? new Date(),
    endDate: new Date(formData.get('endDate') as string) ?? new Date(),
    image: formData.get('image') as File,
    clicks: parseInt(formData.get('clicks') as string ?? '0'),
    position: formData.get('position') ?? '',
    active: formData.get('active') === 'true',
  };

  const sponsorVerified = createSponsorSchema.safeParse(rawData);

  if (!sponsorVerified.success) {
    return {
      ok: false,
      message: sponsorVerified.error.issues[0].message,
      sponsor: null,
    };
  }

  const { image, ...data } = sponsorVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image!, 'sponsors');
    if (!cloudinaryResponse) {
      return {
        ok: false,
        message: '¡ No se pudo subir la imagen al servidor !',
        sponsor: null,
      };
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdSponsor = await transaction.sponsor.create({
        data: {
          name: data.name,
          url: data.url,
          startDate: data.startDate,
          endDate: data.endDate,
          imagePublicId: cloudinaryResponse?.publicId as string,
          imageUrl: cloudinaryResponse?.secureUrl as string,
          position: data.position,
          clicks: data.clicks,
          active: data.active,
        },
      });

      return {
        ok: true,
        message: '¡ Patrocinador creado satisfactoriamente 👍 !',
        sponsor: createdSponsor,
      };
    });

    // Refresh Cache
    updateTag('admin-sponsors');
    updateTag('admin-sponsor');
    updateTag('public-sponsors');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          sponsor: null,
        };
      }

      console.log('Name:', error.name);
      console.log('Cause:', error.cause);
      console.log('Message:', error.message);

      return {
        ok: false,
        message: '¡ Error al crear el patrocinador, revise los logs del servidor !',
        sponsor: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      sponsor: null,
    };
  }
};
