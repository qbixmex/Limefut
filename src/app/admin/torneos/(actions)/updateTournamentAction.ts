'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { editTournamentSchema } from '@/shared/schemas';
import { Tournament } from '@/shared/interfaces';

type Options = {
  formData: FormData;
  tournamentId: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditArticleResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: Tournament | null;
}>;

export const updateTournamentAction = async ({
  formData,
  tournamentId,
  userRoles,
  authenticatedUserId,
}: Options): EditArticleResponse => {
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
      message: '¡ No tienes permisos administrativos para solicitar esta petición !',
      tournament: null,
    };
  }

  const startDate = new Date(formData.get('startDate') as string);
  const endDate = new Date(formData.get('endDate') as string);

  const rawData = {
    name: formData.get('name') ?? undefined,
    permalink: formData.get('permalink') ?? undefined,
    description: formData.get('description') ?? undefined,
    country: formData.get('country') ?? undefined,
    state: formData.get('state') ?? undefined,
    city: formData.get('city') ?? undefined,
    season: formData.get('season') ?? undefined,
    startDate: startDate,
    endDate: endDate,
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
      message: tournamentVerified.error.message,
      tournament: null,
    };
  }

  const tournamentToSave = tournamentVerified.data;

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
          },
        });

        // Revalidate Cache
        revalidatePath('/admin/torneos');

        return {
          ok: true,
          message: '¡ El torneo fue actualizado correctamente 👍 !',
          tournament: {
            id: updatedTournament.id,
            name: updatedTournament.name,
            permalink: updatedTournament.permalink,
            description: updatedTournament.description,
            country: updatedTournament.country,
            state: updatedTournament.state,
            city: updatedTournament.city,
            season: updatedTournament.season,
            startDate: updatedTournament.startDate,
            endDate: updatedTournament.endDate,
            active: updatedTournament.active
          },
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

          return {
            ok: false,
            message: '¡ Error al actualizar el torneo, revise los logs del servidor !',
            tournament: null,
          };
        }
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
