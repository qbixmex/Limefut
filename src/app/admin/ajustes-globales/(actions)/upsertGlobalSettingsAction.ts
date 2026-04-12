'use server';

import { updateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import type { GlobalSettings } from '@/shared/interfaces';
import { GlobalSettingsSchema } from '@/shared/schemas';
import { deleteImage, uploadImage } from '@/shared/actions';

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  globalSettings: GlobalSettings | null;
}>;

export const upsertGlobalSettingsAction = async (
  formData: FormData,
  userRole: string[] | null,
): ResponseCreateAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      globalSettings: null,
    };
  }

  const rawData = {
    // General
    siteName: formData.get('siteName') ?? undefined,
    organizationName: formData.get('organizationName') ?? undefined,
    phone: formData.get('phone') ?? undefined,
    address: formData.get('address') ?? undefined,
    mapsUrl: formData.get('mapsUrl') ?? undefined,
    country: formData.get('country') ?? undefined,
    defaultLanguage: formData.get('defaultLanguage') ?? undefined,
    timeZone: formData.get('timeZone') ?? undefined,
    logoImage: formData.get('logoImage') as File ?? undefined,
    faviconImage: formData.get('faviconImage') as File ?? undefined,

    // Social Media
    facebookUrl: formData.get('facebookUrl') ?? undefined,
    twitterXUrl: formData.get('twitterXUrl') ?? undefined,
    instagramUrl: formData.get('instagramUrl') ?? undefined,
    tiktokUrl: formData.get('tiktokUrl') ?? undefined,
    youtubeUrl: formData.get('youtubeUrl') ?? undefined,
    whatsApp: formData.get('whatsApp') ?? undefined,

    // Maintenance
    maintenanceMode: formData.get('maintenanceMode') === 'true',
    maintenanceMessage: formData.get('maintenanceMessage') ?? undefined,

    // Appearance
    primaryColor: formData.get('primaryColor') ?? undefined,
    secondaryColor: formData.get('secondaryColor') ?? undefined,
    accentColor: formData.get('accentColor') ?? undefined,

    // Analytics
    googleAnalyticsId: formData.get('googleAnalyticsId') ?? undefined,
    googleTagManager: formData.get('googleTagManager') ?? undefined,
    metaPixelId: formData.get('metaPixelId') ?? undefined,

    // Emails
    contactEmail: formData.get('contactEmail') ?? undefined,
    fromEmail: formData.get('fromEmail') ?? undefined,
    replyToEmail: formData.get('replyToEmail') ?? undefined,
  };

  const dataVerified = GlobalSettingsSchema.safeParse(rawData);

  if (!dataVerified.success) {
    return {
      ok: false,
      message: dataVerified.error.issues[0].message,
      globalSettings: null,
    };
  }

  const { logoImage, faviconImage, ...settingsToSave } = dataVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const globalSettings = await transaction.globalSettings.upsert({
        where: { id: 1 },
        update: settingsToSave,
        create: {
          // Ensure always creates with the same ID
          // to maintain a single record
          id: 1,
          ...settingsToSave,
        },
      });

      if (logoImage instanceof File) {
        // Delete previous image if exists
        if (globalSettings.logoPublicId) {
          const cloudinaryResponse = await deleteImage(globalSettings.logoPublicId);
          if (!cloudinaryResponse.ok) {
            throw new Error('¡ Error al intentar eliminar el logo de cloudinary !');
          }
        }

        const logoUploaded = await uploadImage(logoImage, 'general-settings');

        if (!logoUploaded) {
          throw new Error('Error subiendo el logo a cloudinary');
        }

        await transaction.globalSettings.update({
          where: { id: 1 },
          data: {
            logoUrl: logoUploaded.secureUrl,
            logoPublicId: logoUploaded.publicId,
          },
        });

        // Update event object to return.
        globalSettings.logoUrl = logoUploaded.secureUrl;
        globalSettings.logoPublicId = logoUploaded.publicId;
      }

      if (faviconImage instanceof File) {
        // Delete previous image if exists
        if (globalSettings.favIconPublicId) {
          const cloudinaryResponse = await deleteImage(globalSettings.favIconPublicId);
          if (!cloudinaryResponse.ok) {
            throw new Error('¡ Error al intentar eliminar el favicon de cloudinary !');
          }
        }

        const faviconUploaded = await uploadImage(faviconImage, 'general-settings');

        if (!faviconUploaded) {
          throw new Error('Error subiendo el favicon a cloudinary');
        }

        await transaction.globalSettings.update({
          where: { id: 1 },
          data: {
            faviconUrl: faviconUploaded.secureUrl,
            favIconPublicId: faviconUploaded.publicId,
          },
        });

        // Update event object to return.
        globalSettings.faviconUrl = faviconUploaded.secureUrl;
        globalSettings.favIconPublicId = faviconUploaded.publicId;
      }

      return {
        ok: true,
        message: '¡ Ajustes Globales guardados satisfactoriamente 👍 !',
        globalSettings,
      };
    });

    // Refresh Cache
    updateTag('admin-global-settings');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          globalSettings: null,
        };
      }

      console.log('Name:', error.name);
      console.log('Cause:', error.cause);
      console.log('Message:', error.message);

      return {
        ok: false,
        message: '¡ Error al crear los ajustes globales, revise los logs del servidor !',
        globalSettings: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      globalSettings: null,
    };
  }
};
