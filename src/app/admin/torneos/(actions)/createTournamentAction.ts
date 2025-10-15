'use server';

import prisma from "@/lib/prisma";
import { createTournamentSchema } from "@/shared/schemas";
import { revalidatePath } from "next/cache";

export const createTournamentAction = async (
  formData: FormData,
  userRole: string[] | null,
) => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para solicitar esta petición !',
      user: null,
    };
  }

  const startDate = new Date(formData.get('startDate') as string);
  const endDate = new Date(formData.get('endDate') as string);

  const rawData = {
    name: formData.get('name') as string,
    permalink: formData.get('permalink') ?? '',
    description: formData.get('description') as string,
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
      user: null,
    };
  }

  const tournamentToSave = tournamentVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const createdTournament = await transaction.tournament.create({
        data: {
          name: tournamentToSave.name,
          permalink: tournamentToSave.permalink,
          description: tournamentToSave.description,
          country: tournamentToSave.country,
          state: tournamentToSave.state,
          city: tournamentToSave.city,
          season: tournamentToSave.season,
          startDate: tournamentToSave.startDate,
          endDate: tournamentToSave.endDate,
          active: tournamentToSave.active,
        }
      });

      return {
        ok: true,
        message: '¡ Torneo creado satisfactoriamente 👍 !',
        tournament: {
          name: createdTournament.name,
          permalink: createdTournament.permalink,
          description: createdTournament.description,
          country: createdTournament.country,
          state: createdTournament.state,
          city: createdTournament.city,
          season: createdTournament.season,
          startDate: createdTournament.startDate,
          endDate: createdTournament.endDate,
          active: createdTournament.active,
        },
      };
    });

    // Revalidate Paths
    revalidatePath('/admin/torneos');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          user: null,
        };
      }

      return {
        ok: false,
        message: '¡ Error al crear el torneo, revise los logs del servidor !',
        user: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      user: null,
    };
  }
};
