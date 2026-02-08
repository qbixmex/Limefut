'use server';

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateHeroBannerStateAction = async (id: string, state: boolean): ResponseAction => {
  const heroBannerExists = await prisma.heroBanner.count({
    where: { id },
  });

  if (heroBannerExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el banner, quizás fue eliminado ó no existe !',
    };
  }

  const updatedHeroBanner = await prisma.heroBanner.update({
    where: { id },
    data: { active: state },
    select: {
      title: true,
      active: true,
    },
  });

  // Update Cache
  updateTag('admin-banners');
  updateTag('admin-banner');
  updateTag("admin-hero-banner");
  updateTag('public-banners');

  return {
    ok: true,
    message: `¡ El banner "${updatedHeroBanner.title}" fue ${updatedHeroBanner.active ? 'activado' : 'desactivado'} correctamente 👍 !`,
  };
};
