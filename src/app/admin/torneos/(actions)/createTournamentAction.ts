'use server';

import prisma from "@/lib/prisma";
import { uploadImage } from "@/shared/actions";
import type { CloudinaryResponse, Tournament } from "@/shared/interfaces";
import { createTournamentSchema } from "@/shared/schemas";
import { revalidatePath, updateTag } from "next/cache";
import type { GENDER_TYPE } from "@/shared/enums";

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
    category: formData.get('category') ?? undefined,
    format: formData.get('format') ?? '',
    gender: formData.get('gender') ?? '',
    country: formData.get('country') ?? undefined,
    state: formData.get('state') ?? undefined,
    city: formData.get('city') ?? undefined,
    description: formData.get('description') ?? undefined,
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

  const tournamentVerified = createTournamentSchema.safeParse(rawData);

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
          gender: tournamentToSave.gender as GENDER_TYPE,
          imageUrl: cloudinaryResponse?.secureUrl,
          imagePublicID: cloudinaryResponse?.publicId,
        },
      });

      return {
        ok: true,
        message: '¡ Torneo creado satisfactoriamente 👍 !',
        tournament: createdTournament,
      };
    });

    // Refresh Cache
    revalidatePath('/admin/torneos');
    updateTag("dashboard-tournaments");
    updateTag("admin-tournaments-selector");
    updateTag("admin-tournaments-for-match");
    updateTag("admin-tournament-for-match");
    updateTag("admin-tournaments-for-gallery");
    updateTag("tournaments-list");
    updateTag("admin-tournaments-list");
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
