'use server';

import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import type { Pagination } from '@/shared/interfaces';
import { cacheLife, cacheTag } from 'next/cache';

type Options = Readonly<{
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

export type FieldType = {
  id: string;
  name: string;
  permalink: string;
  city: string | null,
  state: string | null;
  country: string | null;
};

export type ResponseFetchTeams = Promise<{
  ok: boolean;
  message: string;
  fields: FieldType[];
  pagination: Pagination;
}>;

export const fetchFieldsAction = async (
  options?: Options,
): ResponseFetchTeams => {
  'use cache';

  cacheLife('days');
  cacheTag('admin-fields');

  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.FieldWhereInput = options?.searchTerm ? {
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
    const fields = await prisma.field.findMany({
      where: whereCondition,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        permalink: true,
        city: true,
        state: true,
        country: true,
      },
      take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.field.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Las canchas fueron obtenidas correctamente 👍',
      fields,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error al intentar obtener los equipos');
      return {
        ok: false,
        message: error.message,
        fields: [],
        pagination: {
          currentPage: 0,
          totalPages: 0,
        },
      };
    }
    console.log(error);
    return {
      ok: false,
      message: 'Error inesperado al obtener las canchas, revise los logs del servidor',
      fields: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }
};
