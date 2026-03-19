'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';
import type { ALIGNMENT_TYPE } from '@/shared/enums';

export type ResponseAction = Promise<{
  ok: boolean;
  message: string;
}>;

export const updateHeroBannerAlignmentAction = async (
  bannerId: string,
  newAlignment: ALIGNMENT_TYPE,
): ResponseAction => {
  const heroBannerExists = await prisma.heroBanner.count({
    where: { id: bannerId },
  });

  if (heroBannerExists === 0) {
    return {
      ok: false,
      message: '¡ No se pudo actualizar el banner, quizás fue eliminado ó no existe !',
    };
  }

  await prisma.heroBanner.update({
    where: { id: bannerId },
    data: { dataAlignment: newAlignment },
    select: { id: true },
  });

  // Update Cache
  updateTag('admin-banners');
  updateTag('admin-banner');
  updateTag('admin-hero-banner');
  updateTag('public-banners');

  return {
    ok: true,
    message: '¡ Se actualizó la alineación correctamente 👍 !',
  };
};
