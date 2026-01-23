'use server';

import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/prisma";

type PageType = {
  id: string;
  title: string;
  content: string;
};

type ResponseAction = Promise<{
  ok: boolean;
  message: string;
  customPage: PageType | null;
}>;

export const fetchCustomPageAction = async (permalink: string): ResponseAction => {
  "use cache";

  cacheLife('weeks');
  cacheTag('public-custom-page');

  try {
    const customPage = await prisma.customPage.findUnique({
      where: { permalink },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    return {
      ok: true,
      message: '! La página personalizada fue obtenida correctamente 👍 !',
      customPage,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener la página personalizada");
      return {
        ok: false,
        message: error.message,
        customPage: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener la página personalizada, revise los logs del servidor",
      customPage: null,
    };
  }
};
