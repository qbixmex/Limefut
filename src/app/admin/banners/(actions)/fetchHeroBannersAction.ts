'use server';

import type { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import type { HeroBanner, Pagination } from "@/shared/interfaces";

type Options = Readonly<{
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  heroBanners: Pick<HeroBanner, 'id' | 'title' | 'imageUrl' | 'position' | 'active'>[];
  pagination: Pagination | null;
}>;

export const fetchHeroBannersAction = async (options?: Options): ResponseFetch => {
  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.HeroBannerWhereInput = options?.searchTerm ? {
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
    const heroBanners = await prisma.heroBanner.findMany({
      where: whereCondition,
      select:  {
        id: true,
        title: true,
        imageUrl: true,
        position: true,
        active: true,
      },
      orderBy: { position: 'asc' },
      take: take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.heroBanner.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Los banners fueron obtenidos correctamente 👍',
      heroBanners,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los banners");
      return {
        ok: false,
        message: error.message,
        heroBanners: [],
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los banners, revise los logs del servidor",
      heroBanners: [],
      pagination: null,
    };
  }
};
