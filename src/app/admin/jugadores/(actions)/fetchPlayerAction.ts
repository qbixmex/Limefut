'use server';

import prisma from '@/lib/prisma';
import { Coach } from "@/shared/interfaces";

type FetchCoachResponse = Promise<{
  ok: boolean;
  message: string;
  coach: Coach | null;
}>;

export const fetchPlayerAction = async (
  coachId: string,
  userRole: string[] | null,
): FetchCoachResponse => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      coach: null,
    };
  }

  try {
    const coach = await prisma.coach.findUnique({
      where: { id: coachId },
    });

    if (!coach) {
      return {
        ok: false,
        message: '¡ Entrenador no encontrado ❌ !',
        coach: null,
      };
    }

    return {
      ok: true,
      message: '¡ Entrenador obtenido correctamente 👍 !',
      coach,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener el entrenador,\n¡ Revise los logs del servidor !",
        coach: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      coach: null,
    };
  }
};
