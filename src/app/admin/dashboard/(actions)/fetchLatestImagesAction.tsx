'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

type Options = Readonly<{
  quantity: number;
}>;

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  latestImages: {
    id: string;
    title: string;
    permalink: string | null;
    imageUrl: string;
  }[];
}>;

export const fetchLatestImagesAction = async ({ quantity }: Options): Promise<ResponseFetch> => {
  "use cache";

  cacheLife('days');
  cacheTag('dashboard-images');

  try {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now);
    endDate.setDate(now.getDate());
    endDate.setHours(23, 59, 59, 999);

    const latestImages = await prisma.galleryImage.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        active: true,
      },
      select: {
        id: true,
        title: true,
        permalink: true,
        imageUrl: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: quantity,
    });

    return {
      ok: true,
      message: '! Las imágenes fueron obtenidas correctamente 👍',
      latestImages,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener las imágenes");
      return {
        ok: false,
        message: error.message,
        latestImages: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener las imágenes, revise los logs del servidor",
      latestImages: [],
    };
  }
};
