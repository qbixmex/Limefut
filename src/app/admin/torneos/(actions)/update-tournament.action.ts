'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import { editTournamentSchema } from '@/shared/schemas';
import type { CloudinaryResponse, Tournament } from '@/shared/interfaces';
import { deleteImage, uploadImage } from '@/shared/actions';
import type { GENDER_TYPE } from '@/shared/enums';
import { Prisma } from '@/generated/prisma/client';

type Options = {
  formData: FormData;
  tournamentId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  tournament: Tournament | null;
}>;

export const updateTournamentAction = async ({
  formData,
  tournamentId,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      tournament: null,
    };
  }

  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      tournament: null,
    };
  }

  const startDate = new Date(formData.get('startDate') as string);
  const endDate = new Date(formData.get('endDate') as string);
  const currentWeek = Number(formData.get('currentWeek') ?? '0');

  const rawData = {
    name: formData.get('name') ?? undefined,
    permalink: formData.get('permalink') ?? undefined,
    image: formData.get('image'),
    categoriesIds: formData.has('categoriesIds')
      ? JSON.parse(formData.get('categoriesIds') as string ?? 'undefined')
      : undefined,
    description: formData.get('description') ?? undefined,
    format: formData.get('format') as string,
    gender: formData.get('gender') as string,
    country: formData.get('country') ?? undefined,
    state: formData.get('state') ?? undefined,
    city: formData.get('city') ?? undefined,
    season: formData.get('season') ?? undefined,
    startDate,
    endDate,
    currentWeek,
    active: formData.get('active') === 'true',
  };

  const tournamentVerified = editTournamentSchema.safeParse(rawData);

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
    cloudinaryResponse = await uploadImage(image!, 'teams');
    if (!cloudinaryResponse) {
      throw new Error('Error subiendo imagen a cloudinary');
    }
  }

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      try {
        const isTournamentExists = await transaction.tournament.count({
          where: { id: tournamentId },
        });

        if (!isTournamentExists) {
          return {
            ok: false,
            message: '¡ El torneo no existe o ha sido eliminado !',
            tournament: null,
          };
        }

        const updatedTournament = await transaction.tournament.update({
          where: { id: tournamentId },
          data: {
            ...tournamentToSave,
            gender: tournamentToSave.gender as GENDER_TYPE ?? undefined,
            imageUrl: cloudinaryResponse?.secureUrl ?? undefined,
            imagePublicID: cloudinaryResponse?.publicId ?? undefined,
          },
        });

        // Update TeamField records for the many-to-many relationship
        if (categoriesIds !== undefined) {
          // Delete existing relationships
          await transaction.tournamentCategory.deleteMany({
            where: { tournamentId },
          });

          // Create new relationships if any
          if (categoriesIds.length > 0) {
            await transaction.tournamentCategory.createMany({
              data: categoriesIds.map((categoryId) => ({
                tournamentId,
                categoryId,
              })),
            });
          }
        }

        if (image !== null) {
          // Delete previous image from cloudinary.
          if (updatedTournament.imagePublicID) {
            const cloudinaryResponse = await deleteImage(updatedTournament.imagePublicID);
            if (!cloudinaryResponse.ok) {
              throw new Error('¡ Error al intentar eliminar la imagen de cloudinary !');
            }
          }

          // Upload Image to third-party storage (cloudinary).
          const imageUploaded = await uploadImage(image as File, 'tournaments');

          if (!imageUploaded) {
            throw new Error('¡ Error al intentar subir la imagen a cloudinary !');
          }

          // Update image data to database.
          await transaction.tournament.update({
            where: { id: tournamentId },
            data: {
              imageUrl: imageUploaded.secureUrl,
              imagePublicID: imageUploaded.publicId,
            },
          });

          // Update event object to return.
          updatedTournament.imageUrl = imageUploaded.secureUrl;
          updatedTournament.imagePublicID = imageUploaded.publicId;
        }

        // Update Cache
        updateTag('admin-tournaments');
        updateTag('admin-tournaments-selector');
        updateTag('admin-tournaments-for-coach');
        updateTag('admin-tournaments-for-match');
        updateTag('admin-tournament-for-match');
        updateTag('admin-tournaments-for-gallery');
        updateTag('admin-tournament');
        updateTag('public-tournaments-list');
        updateTag('public-tournaments');
        updateTag('public-tournament');
        updateTag('dashboard-tournaments');

        return {
          ok: true,
          message: '¡ El torneo fue actualizado correctamente 👍 !',
          tournament: updatedTournament,
        };
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
            message: '¡ Error al actualizar el torneo, revise los logs del servidor !',
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
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      tournament: null,
    };
  }
};
