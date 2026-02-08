'use server';

import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import type { Pagination } from "@/shared/interfaces";
import { cacheLife, cacheTag } from "next/cache";

type Options = Readonly<{
  userRole: string[] | null;
  page?: number;
  take?: number;
  searchTerm?: string;
}>;

type GalleryType = {
  id: string;
  title: string;
  permalink: string;
  galleryDate: Date;
  active: boolean;
  imagesCount: number;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  galleries: GalleryType[];
  pagination: Pagination;
}>;

export const fetchGalleriesAction = async (options: Options): ResponseAction => {
  "use cache";

  cacheLife("days");
  cacheTag("admin-galleries");

  if ((options.userRole !== null) && (!options.userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      galleries: [],
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

  const whereCondition: Prisma.GalleryWhereInput = options?.searchTerm ? {
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
    const galleries = await prisma.gallery.findMany({
      where: whereCondition,
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        permalink: true,
        galleryDate: true,
        active: true,
        _count: {
          select: { images: true },
        },
      },
      take: take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.gallery.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Las galerías fueron obtenidas correctamente 👍',
      galleries: galleries.map((gallery) => ({
        ...gallery,
        imagesCount: gallery._count.images,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los equipos");
      return {
        ok: false,
        message: error.message,
        galleries: [],
        pagination: {
          currentPage: 0,
          totalPages: 0,
        },
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los equipos, revise los logs del servidor",
      galleries: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }
};
