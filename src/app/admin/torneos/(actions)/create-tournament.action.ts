'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/shared/actions';
import type { STAGE_TYPE } from '@/shared/enums';
import type { CloudinaryResponse, Tournament } from '@/shared/interfaces';
import { createTournamentSchema } from '@/shared/schemas';
import { revalidatePath, updateTag } from 'next/cache';

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  tournament: Tournament | null;
}>;

export const createTournamentAction = async ({
  formData,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
  formData: FormData;
}): ResponseCreateAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      tournament: null,
    };
  }

  if (
    (authenticatedUserRoles && authenticatedUserRoles.length > 0) &&
    (!authenticatedUserRoles.includes('admin'))
  ) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      tournament: null,
    };
  }

  const rawData = {
    name: formData.get('name') as string,
    permalink: formData.get('permalink') ?? '',
    image: formData.get('image') as File,
    categoriesIds: formData.has('categoriesIds')
      ? JSON.parse(formData.get('categoriesIds') as string)
      : undefined,
    country: formData.get('country') ?? undefined,
    cities: formData.has('cities')
      ? JSON.parse(formData.get('cities') as string)
      : undefined,
    description: formData.get('description') ?? undefined,
    season: formData.get('season') ?? undefined,
    startDate: new Date(formData.get('startDate') as string),
    endDate: new Date(formData.get('endDate') as string),
    stage: formData.get('stage') as string,
    active: formData.get('active') === 'true',
  };

  const tournamentVerified = createTournamentSchema.safeParse(rawData);

  if (!tournamentVerified.success) {
    return {
      ok: false,
      message: tournamentVerified.error.issues[0].message,
      tournament: null,
    };
  }

  const { image, categoriesIds, ...tournamentToSave } = tournamentVerified.data;

  // Upload Image to third-party storage (cloudinary).
  let cloudinaryResponse: CloudinaryResponse | null = null;

  if (image) {
    cloudinaryResponse = await uploadImage(image!, 'tournaments');
    if (!cloudinaryResponse) {
      throw new Error('Error subiendo imagen a cloudinary');
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdTournament = await transaction.tournament.create({
        data: {
          name: tournamentToSave.name,
          permalink: tournamentToSave.permalink,
          country: tournamentToSave.country,
          cities: tournamentToSave.cities,
          season: tournamentToSave.season,
          description: tournamentToSave.description,
          startDate: tournamentToSave.startDate,
          endDate: tournamentToSave.endDate,
          stage: tournamentToSave.stage as STAGE_TYPE,
          imageUrl: cloudinaryResponse?.secureUrl,
          imagePublicID: cloudinaryResponse?.publicId,
          active: tournamentToSave.active,
        },
      });

      // Create Tournament Category records for the many-to-many relationship
      if (categoriesIds && categoriesIds.length > 0) {
        await transaction.tournamentCategory.createMany({
          data: categoriesIds.map((categoryId) => ({
            tournamentId: createdTournament.id,
            categoryId,
          })),
        });
      }

      return {
        ok: true,
        message: '¡ Torneo creado satisfactoriamente 👍 !',
        tournament: createdTournament,
      };
    });

    // Refresh Cache
    revalidatePath('/admin/torneos');
    updateTag('dashboard-tournaments');
    updateTag('admin-tournaments-selector');
    updateTag('tournaments-selector-list');
    updateTag('admin-tournaments-for-coach');
    updateTag('admin-tournaments-for-match');
    updateTag('admin-tournament-for-match');
    updateTag('admin-tournaments-for-gallery');
    updateTag('admin-standings');
    updateTag('admin-tournaments-list');
    updateTag('admin-tournament-id');
    updateTag('tournaments-list');
    updateTag('public-tournaments-list');
    updateTag('public-tournaments');
    updateTag('public-tournament');
    updateTag('categories-selector-list');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        if (error.meta) {
          console.log('ERROR METADATA:', error.meta);
        }

        return {
          ok: false,
          message: '¡ Hay campos duplicados, revise los logs del servidor !',
          tournament: null,
        };
      }

      return {
        ok: false,
        message: '¡ Error al crear el torneo, revise los logs del servidor !',
        tournament: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      tournament: null,
    };
  }
};
