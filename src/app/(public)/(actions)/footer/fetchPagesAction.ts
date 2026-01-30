'use server';

import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/prisma";

export type PageType = {
  id: string;
  title: string | null;
  permalink: string | null;
};

type ResponseFetchPagesLink = Promise<{
  ok: boolean;
  message: string;
  pageLinks: PageType[];
}>;

export const fetchPagesAction = async (): ResponseFetchPagesLink => {
  "use cache";

  cacheLife('weeks');
  cacheTag('public-page-links');

  try {
    const pages = await prisma.customPage.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        title: true,
        permalink: true,
      },
      orderBy: { position: 'asc' },
    });

    return {
      ok: true,
      message: '! Los links de las páginas fueron obtenidos correctamente 👍',
      pageLinks: pages,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los links de las páginas");
      return {
        ok: false,
        message: error.message,
        pageLinks: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los links de las páginas, revise los logs del servidor",
      pageLinks: [],
    };
  }
};
