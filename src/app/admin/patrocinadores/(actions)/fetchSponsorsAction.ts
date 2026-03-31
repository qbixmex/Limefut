'use server';

import { cacheLife, cacheTag } from 'next/cache';
import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import type { Pagination } from '@/shared/interfaces';

type Options = Readonly<{
  userRoles: string[];
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

export type SponsorType = {
  id: string;
  name: string;
  url: string | null;
  imageUrl: string;
  startDate: Date | null;
  endDate: Date | null;
  position: string;
  clicks: number;
  active: boolean;
};

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  sponsors: SponsorType[];
  pagination: Pagination | null;
}>;

export const fetchSponsorsAction = async (options: Options): ResponseFetch => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-sponsors');

  if (!options.userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      sponsors: [],
      pagination: null,
    };
  }

  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.SponsorWhereInput = options?.searchTerm ? {
    OR: [
      {
        name: {
          contains: options.searchTerm,
          mode: 'insensitive' as const,
        },
      },
    ],
  } : {};

  try {
    const sponsors = await prisma.sponsor.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        url: true,
        imageUrl: true,
        startDate: true,
        endDate: true,
        position: true,
        clicks: true,
        active: true,
      },
      orderBy: { position: 'asc' },
      take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.sponsor.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Los patrocinadores fueron obtenidos correctamente 👍',
      sponsors,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los banners');
      console.log('NAME:', error.name);
      console.log('MESSAGE:', error.message);

      return {
        ok: false,
        message: error.message,
        sponsors: [],
        pagination: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado al obtener los patrocinadores, revise los logs del servidor',
      sponsors: [],
      pagination: null,
    };
  }
};
