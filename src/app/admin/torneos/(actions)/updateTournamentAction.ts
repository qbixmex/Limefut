'use server';

import prisma from '@/lib/prisma';
import { revalidatePath, updateTag } from 'next/cache';
import { editTournamentSchema } from '@/shared/schemas';
import type { CloudinaryResponse, Tournament } from '@/shared/interfaces';
import { deleteImage, uploadImage } from '@/shared/actions';

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
    description: formData.get('description') ?? undefined,
    category: formData.get('category') ?? undefined,
    format: formData.get('format') ?? undefined,
    country: formData.get('country') ?? undefined,
    state: formData.get('state') ?? undefined,
    city: formData.get('city') ?? undefined,
    season: formData.get('season') ?? undefined,
    startDate: startDate,
    endDate: endDate,
    currentWeek,
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const tournamentVerified = editTournamentSchema.safeParse(rawData);

  if (!tournamentVerified.success) {
    return {
      ok: false,
      message: tournamentVerified.error.issues[0].message,
      tournament: null,
    };
  }

  const { image, ...tournamentToSave } = tournamentVerified.data;

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
          data: tournamentToSave,
        });

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
        revalidatePath('/admin/torneos');
        updateTag("admin-tournaments-list");
        updateTag("public-tournaments-list");
        updateTag("public-tournaments");
        updateTag("public-tournament");
        updateTag("dashboard-tournaments");

        return {
          ok: true,
          message: '¡ El torneo fue actualizado correctamente 👍 !',
          tournament: updatedTournament,
        };
      } catch (error) {
        if (error instanceof Error && 'meta' in error && error.meta) {
          if ('code' in error && error.code as string === 'P2002') {
            const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
            return {
              ok: false,
              message: `¡ El campo "${fieldError}", está duplicado !`,
              tournament: null,
            };
          }
          console.log(error.message);
          return {
            ok: false,
            message: '¡ Error al actualizar el torneo, revise los logs del servidor !',
            tournament: null,
          };
        }
        console.log((error as Error).message);
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
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
