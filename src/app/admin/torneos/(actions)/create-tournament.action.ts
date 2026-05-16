'use server';

import prisma from '@/lib/prisma';
import { uploadImage } from '@/shared/actions';
import type { CloudinaryResponse, Tournament } from '@/shared/interfaces';
import { createTournamentSchema } from '@/shared/schemas';
import { revalidatePath, updateTag } from 'next/cache';
import { Prisma } from '@/generated/prisma/client';

type ResponseCreateAction = Promise<{
  ok: boolean;
  message: string;
  tournament: Tournament | null;
}>;

export const createTournamentAction = async (
  formData: FormData,
  userRole: string[] | null,
): ResponseCreateAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      tournament: null,
    };
  }

  const startDate = new Date(formData.get('startDate') as string);
  const endDate = new Date(formData.get('endDate') as string);
  const currentWeek = Number(formData.get('currentWeek') ?? '');

  const rawData = {
    name: formData.get('name') as string,
    permalink: formData.get('permalink') ?? '',
    image: formData.get('image') as File,
    categoriesIds: formData.has('categoriesIds')
      ? JSON.parse(formData.get('categoriesIds') as string ?? 'undefined')
      : undefined,
    format: formData.get('format') ?? '',
    gender: formData.get('gender') ?? 'unknown',
    country: formData.get('country') ?? undefined,
    state: formData.get('state') ?? undefined,
    city: formData.get('city') ?? undefined,
    description: formData.get('description') ?? undefined,
    season: formData.get('season') ?? undefined,
    startDate,
    endDate,
    currentWeek,
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
          ...tournamentToSave,
          format: '9',
          gender: 'male',
          category: 'unknown',
          stage: 'regular',
          imageUrl: cloudinaryResponse?.secureUrl,
          imagePublicID: cloudinaryResponse?.publicId,
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
    updateTag('admin-tournaments-for-coach');
    updateTag('admin-tournaments-for-match');
    updateTag('admin-tournament-for-match');
    updateTag('admin-tournaments-for-gallery');
    updateTag('tournaments-list');
    updateTag('admin-tournaments-list');
    updateTag('public-tournaments-list');
    updateTag('public-tournaments');
    updateTag('public-tournament');

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
