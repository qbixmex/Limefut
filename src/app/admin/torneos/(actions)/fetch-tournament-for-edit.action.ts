'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { cacheLife, cacheTag } from 'next/cache';

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  imagePublicID: string | null;
  description: string | null;
  categoriesIds: string[];
  country: string | null;
  cities: string[];
  season: string | null;
  startDate: Date;
  endDate: Date;
  active: boolean;
};

type FetchResponse = Promise<{
  ok: boolean;
  message: string;
  tournament: TOURNAMENT_TYPE | null,
}>;

export const fetchTournamentForEditAction = async ({
  tournamentId,
  authenticatedUserId,
  authenticatedUserRoles,
}: {
  tournamentId: string,
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}): FetchResponse => {
  'use cache';

  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
      tournament: null,
    };
  }

  if ((!authenticatedUserRoles?.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      tournament: null,
    };
  }

  cacheLife('days');
  cacheTag('admin-tournament');

  try {
    const tournamentSelect = {
      id: true,
      name: true,
      permalink: true,
      imageUrl: true,
      imagePublicID: true,
      description: true,
      country: true,
      cities: true,
      season: true,
      startDate: true,
      endDate: true,
      active: true,
      categories: {
        select: {
          categoryId: true,
        },
      },
    } satisfies Prisma.TournamentSelect;

    const tournament = await prisma.tournament.findFirst({
      where: { id: tournamentId },
      select: tournamentSelect,
    });

    if (!tournament) {
      return {
        ok: false,
        message: '¡ El torneo no existe con el id subministrado ❌ !',
        tournament: null,
      };
    }

    return {
      ok: true,
      message: '¡ El torneo fue obtenido correctamente 👍 !',
      tournament: {
        id: tournament.id,
        name: tournament.name,
        permalink: tournament.permalink,
        imageUrl: tournament.imageUrl,
        imagePublicID: tournament.imagePublicID,
        description: tournament.description,
        country: tournament.country,
        cities: tournament.cities,
        season: tournament.season,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        active: tournament.active,
        categoriesIds: tournament.categories.map((c) => c.categoryId),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener el torneo,\n¡ Revise los logs del servidor !',
        tournament: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      tournament: null,
    };
  }
};
