'use server';

import prisma from '@/lib/prisma';
import type { Gallery } from "@/shared/interfaces";

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  gallery: Gallery & {
    team: { id: string; };
  } | null;
}>;

export const fetchGalleryAction = async (
  userRoles: string[],
  permalink: string,
): FetchTeamResponse => {
  if (!userRoles.includes('admin')) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      gallery: null,
    };
  }

  try {
    const gallery = await prisma.gallery.findUnique({
      where: { permalink: permalink },
      select: {
        id: true,
        title: true,
        permalink: true,
        galleryDate: true,
        active: true,
        team: {
          select: {
            id: true,
          },
        }
      }
    });

    if (!gallery) {
      return {
        ok: false,
        message: '¡ Galería no encontrada ❌ !',
        gallery: null,
      };
    }

    return {
      ok: true,
      message: '¡ Galería obtenida correctamente 👍 !',
      gallery,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener la galería,\n¡ Revise los logs del servidor !",
        gallery: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      gallery: null,
    };
  }
};
