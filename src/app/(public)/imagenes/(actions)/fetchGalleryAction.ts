'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type GalleryType = {
  title: string;
  galleryDate: Date;
  tournament: TournamentType | null;
  team: TeamType | null;
  images: GalleryImageType[];
};

type TournamentType = {
  name: string;
  permalink: string;
};

type TeamType = {
  name: string;
  permalink: string;
};

export type GalleryImageType = {
  id: string;
  title: string;
  imageUrl: string;
};

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  gallery: GalleryType | null;
}>;

export const fetchGalleryAction = async (galleryPermalink: string): ResponseAction => {
  "use cache";

  cacheLife('days');
  cacheTag('public-gallery');

  try {
    const gallery = await prisma.gallery.findUnique({
      where: {
        permalink: galleryPermalink,
        active: true,
      },
      select: {
        title: true,
        permalink: true,
        galleryDate: true,
        tournament: {
          select: {
            name: true,
            permalink: true,
          },
        },
        team: {
          select: {
            name: true,
            permalink: true,
          },
        },
        images: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!gallery) {
      return {
        ok: false,
        message: '! No se pudo obtener la galería ❌',
        gallery: null,
      };
    }

    return {
      ok: true,
      message: '! La galería fue obtenida correctamente 👍',
      gallery,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener la galería");
      return {
        ok: false,
        message: error.message,
        gallery: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener la galería, revise los logs del servidor",
      gallery: null,
    };
  }
};
