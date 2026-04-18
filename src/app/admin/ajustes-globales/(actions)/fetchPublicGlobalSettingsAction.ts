'use server';

import { cacheLife, cacheTag } from 'next/cache';
import prisma from '@/lib/prisma';
import type { GlobalSettings } from '@/generated/prisma/client';

type FetchVideoResponse = Promise<{
  ok: boolean;
  message: string;
  globalSettings: GlobalSettings | null;
}>;

export const fetchPublicGlobalSettingsAction = async (): FetchVideoResponse => {
  'use cache';

  cacheLife('weeks');
  cacheTag('public-global-settings');

  try {
    const globalSettings = await prisma.globalSettings.findFirst({
      where: { id: 1 },
    });

    if (!globalSettings) {
      return {
        ok: false,
        message: '¡ Ajustes globales no encontrados ❌ !',
        globalSettings: null,
      };
    }

    return {
      ok: true,
      message: '¡ Ajustes globales obtenidos correctamente 👍 !',
      globalSettings,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: 'No se pudo obtener los ajustes globales,\n¡ Revise los logs del servidor !',
        globalSettings: null,
      };
    }
    return {
      ok: false,
      message: 'Error inesperado del servidor,\n¡ Revise los logs del servidor !',
      globalSettings: null,
    };
  }
};
