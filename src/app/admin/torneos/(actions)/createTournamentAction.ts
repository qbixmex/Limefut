'use server';

import prisma from "@/lib/prisma";
import { uploadImage } from "@/shared/actions";
import type { CloudinaryResponse, Tournament } from "@/shared/interfaces";
import { createTournamentSchema } from "@/shared/schemas";
import { revalidatePath, updateTag } from "next/cache";

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

  const rawData = {
    name: formData.get('name') as string,
    permalink: formData.get('permalink') ?? '',
    image: formData.get('image') as File,
    description: formData.get('description') as string,
    division: formData.get('division') as string,
    group: formData.get('group') as string,
    country: formData.get('country') as string,
    state: formData.get('state') as string,
    city: formData.get('city') as string,
    season: formData.get('season') as string,
    startDate: startDate,
    endDate: endDate,
    active: (formData.get('active') === 'true')
      ? true
      : (formData.get('active') === 'false')
        ? false
        : false,
  };

  const tournamentVerified = createTournamentSchema.safeParse(rawData);

  if (!tournamentVerified.success) {
    return {
      ok: false,
      message: tournamentVerified.error.message,
      tournament: null,
    };
  }

  const { image, ...tournamentToSave } = tournamentVerified.data;
  
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
          imageUrl: cloudinaryResponse?.secureUrl,
          imagePublicID: cloudinaryResponse?.publicId,
        }
      });

      return {
        ok: true,
        message: '¡ Torneo creado satisfactoriamente 👍 !',
        tournament: createdTournament,
      };
    });

    // Refresh Cache
    revalidatePath('/admin/torneos');
    updateTag("public-tournaments-list");
    updateTag("public-tournaments");
    updateTag("public-tournament");

    return prismaTransaction;
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
