'use server';

import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/prisma";

export type HeroBanner = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dataAlignment: string;
  showData: boolean;
  position: number;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  heroBanners: HeroBanner[];
}>;

export const fetchPublicHeroBannersAction = async (): ResponseAction => {
  "use cache";

  cacheLife('days');
  cacheTag('public-banners');

  try {

    const heroBanners = await prisma.heroBanner.findMany({
      where: { active: true },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        dataAlignment: true,
        showData: true,
        position: true,
      },
    });

    return {
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente 👍',
      heroBanners: heroBanners.map((banner) => ({
        id: banner.id,
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
        dataAlignment: banner.dataAlignment,
        showData: banner.showData,
        position: banner.position,
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los encuentros");
      return {
        ok: false,
        message: error.message,
        heroBanners: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los encuentros, revise los logs del servidor",
      heroBanners: [],
    };
  }
};

export default fetchPublicHeroBannersAction;
