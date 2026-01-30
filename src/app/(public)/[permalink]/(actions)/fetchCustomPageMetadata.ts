'use server';

import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/prisma";

export type PageMetadataType = {
  id: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoRobots: string | null;
};

type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  pageMetadata: PageMetadataType | null;
}>;

export const fetchCustomPageMetadataAction = async (permalink: string): ResponseAction => {
  "use cache";

  cacheLife('max');
  cacheTag(`public-page-metadata-${permalink}`);

  try {
    const pageMetadata = await prisma.customPage.findUnique({
      where: { permalink },
      select: {
        id: true,
        seoTitle: true,
        seoDescription: true,
        seoRobots: true,
      },
    });

    return {
      ok: true,
      message: '! La página personalizada fue obtenida correctamente 👍 !',
      pageMetadata,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los metadatos de la página personalizada");
      return {
        ok: false,
        message: error.message,
        pageMetadata: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los metadatos de la página personalizada, revise los logs del servidor",
      pageMetadata: null,
    };
  }
};
