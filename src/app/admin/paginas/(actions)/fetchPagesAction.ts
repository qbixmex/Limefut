'use server';

import type { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import type { Pagination } from "@/shared/interfaces";

type Options = Readonly<{
  userRole: string[] | null;
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

type PageType = {
  id: string;
  title: string;
  permalink: string;
  seoRobots: string | null;
  position: number;
  active: boolean;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  customPages: PageType[];
  pagination: Pagination;
}>;

export const fetchPagesAction = async (options: Options): ResponseAction => {
  if ((options.userRole !== null) && (!options.userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      customPages: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }
  let { page = 1, take = 12 } = options;

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.CustomPageWhereInput = options?.searchTerm ? {
    OR: [
      {
        title: {
          contains: options.searchTerm,
          mode: 'insensitive' as const,
        },
      },
    ],
  } : {};

  try {
    const pages = await prisma.customPage.findMany({
      where: whereCondition,
      orderBy: { position: 'asc' },
      select: {
        id: true,
        title: true,
        permalink: true,
        active: true,
        seoRobots: true,
        position: true,
      },
      take: take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.customPage.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Las páginas fueron obtenidas correctamente 👍',
      customPages: pages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener las páginas");
      return {
        ok: false,
        message: error.message,
        customPages: [],
        pagination: {
          currentPage: 0,
          totalPages: 0,
        },
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener las páginas, revise los logs del servidor",
      customPages: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }
};
