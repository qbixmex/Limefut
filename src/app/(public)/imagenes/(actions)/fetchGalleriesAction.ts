'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type GalleryType = {
  id: string;
  title: string;
  permalink: string;
  galleryDate: Date;
  image: ImageType;
};

type ImageType = {
  title: string;
  imageUrl: string;
};

export type ResponseAction = Promise<{
    ok: boolean;
    message: string;
    galleries: GalleryType[];
  }>;

export const fetchGalleriesAction = async (): ResponseAction => {
  "use cache";

  cacheLife('days');
  cacheTag('public-galleries');

  try {
    const galleries = await prisma.gallery.findMany({
      where: {
        active: true,
        images: {
          some: {}, // Retrieve Galleries with images inside
        },
      },
      select: {
        id: true,
        title: true,
        permalink: true,
        galleryDate: true,
        images: {
          select: {
            title: true,
            imageUrl: true,
          },
          take: 1,
        },
      },
    });

    return {
      ok: true,
      message: '! Las gallerias fueron obtenidas correctamente 👍',
      galleries: galleries.map((gallery) => ({
        id: gallery.id,
        title: gallery.title,
        permalink: gallery.permalink,
        galleryDate: gallery.galleryDate,
        image: {
          title: gallery.images[0].title,
          imageUrl: gallery.images[0].imageUrl,
        },
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener las galerias");
      return {
        ok: false,
        message: error.message,
        galleries: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener las galerias, revise los logs del servidor",
      galleries: [],
    };
  }
};
