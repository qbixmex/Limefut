'use server';

import prisma from '@/lib/prisma';
import { MATCH_STATUS } from '@/root/src/shared/enums';
import { Match } from "@/shared/interfaces";

type FetchPlayerResponse = Promise<{
  ok: boolean;
  message: string;
  match: Match | null;
}>;

export const fetchMatchAction = async (
  id: string,
  userRole: string[] | null,
): FetchPlayerResponse => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      match: null,
    };
  }

  try {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
          },
        },
      }
    });

    if (!match) {
      return {
        ok: false,
        message: '¡ Encuentro no encontrado ❌ !',
        match: null,
      };
    }

    return {
      ok: true,
      message: '¡ Encuentro obtenido correctamente 👍 !',
      match: {
        ...match,
        localScore: match.localScore ?? 0,
        visitorScore: match.visitorScore ?? 0,
        status: match.status as MATCH_STATUS,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener el encuentro,\n¡ Revise los logs del servidor !",
        match: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      match: null,
    };
  }
};
