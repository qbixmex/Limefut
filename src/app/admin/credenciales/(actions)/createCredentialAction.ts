'use server';

import prisma from "@/lib/prisma";
import { createCredentialSchema } from "@/shared/schemas";
import { revalidatePath } from "next/cache";
import type { Credential } from "@/shared/interfaces";

type CreateResponseAction = Promise<{
  ok: boolean;
  message: string;
  credential: Credential | null;
}>;

export const createCredentialAction = async (
  formData: FormData,
  userRole: string[] | null,
): CreateResponseAction => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      credential: null,
    };
  }

  const rawData = {
    fullName: formData.get('fullName') ?? '',
    playerId: formData.get('playerId') ?? '',
    curp: formData.get('curp') ?? '',
    position: formData.get('position') ?? '',
    jerseyNumber: parseInt(formData.get('jerseyNumber') as string) ?? '',
  };

  const credentialVerified = createCredentialSchema.safeParse(rawData);

  if (!credentialVerified.success) {
    return {
      ok: false,
      message: credentialVerified.error.message,
      credential: null,
    };
  }

  const data = credentialVerified.data;

  try {
    const prismaTransaction = await prisma.$transaction(async (transaction) => {
      const player = await prisma.player.findFirst({
        where: { id: data.playerId },
        select: {
          name: true,
          birthday: true,
          team: {
            select: {
              tournament: {
                select: {
                  id: true,
                }
              },
            }
          },
        }
      });

      if (!player) {
        return {
          ok: false,
          message: `¡ El jugador: "${data.fullName}" no existe !`,
          credential: null,
        };
      }

      const countCredential = await transaction.credential.count({
        where: { playerId: data.playerId },
      });

      if (countCredential) {
        return {
          ok: false,
          message: `¡ La credencial con el jugador: "${data.fullName}" ya existe !`,
          credential: null,
        };
      }

      const createdCredential = await transaction.credential.create({
        data: {
          fullName: data.fullName,
          birthdate: player.birthday as Date,
          curp: data.curp,
          position: data.position,
          jerseyNumber: data.jerseyNumber,
          playerId: data.playerId,
          tournamentId: player.team?.tournament?.id as string,
        },
      });

      return {
        ok: true,
        message: '¡ Credencial creada correctamente 👍 !',
        credential: createdCredential,
      };
    });

    // Revalidate Paths
    revalidatePath('/admin/credenciales');

    return prismaTransaction;
  } catch (error) {
    if (error instanceof Error && 'meta' in error && error.meta) {
      if ('code' in error && error.code as string === 'P2002') {
        const fieldError = (error.meta as { modelName: string; target: string[] }).target[0];
        return {
          ok: false,
          message: `¡ El campo "${fieldError}", está duplicado !`,
          credential: null,
        };
      }
      console.log(error.message);
      return {
        ok: false,
        message: '¡ Error al crear la credencial, revise los logs del servidor !',
        credential: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      credential: null,
    };
  }
};
