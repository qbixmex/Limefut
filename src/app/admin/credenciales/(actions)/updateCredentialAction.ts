'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { editCredentialSchema } from '@/shared/schemas';
import { type Credential } from '@/shared/interfaces';

type Options = {
  formData: FormData;
  id: string;
  userRoles: string[];
  authenticatedUserId: string;
};

type EditResponseAction = Promise<{
  ok: boolean;
  message: string;
  credential: Credential | null;
}>;

export const updateCredentialAction = async ({
  formData,
  id,
  userRoles,
  authenticatedUserId,
}: Options): EditResponseAction => {
  if (!authenticatedUserId) {
    return {
      ok: false,
      message: '¡ Usuario no autenticado !',
      credential: null,
    };
  }

  if (!userRoles.includes('admin')) {
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

  const credentialVerified = editCredentialSchema.safeParse(rawData);

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
      try {
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

        if (!countCredential) {
          return {
            ok: false,
            message: `¡ La credencial con el jugador: "${data.fullName}" no existe !`,
            credential: null,
          };
        }

        const updatedCredential = await transaction.credential.update({
          where: { id },
          data: {
            fullName: data.fullName,
            birthdate: player.birthday as Date ?? undefined,
            curp: data.curp,
            position: data.position,
            jerseyNumber: data.jerseyNumber,
            playerId: data.playerId,
            tournamentId: player.team?.tournament.id as string,
          },
          include: {
            tournament: {
              select: {
                id: true,
                name: true,
              },
            },
          }
        });

        // Revalidate Cache
        revalidatePath('/admin/credenciales');

        return {
          ok: true,
          message: '¡ La credencial fue actualizada correctamente 👍 !',
          credential: updatedCredential,
        };
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
          console.log("Mensaje de Error:");
          console.log(error.meta);
          console.log("Error:", error.message);
          return {
            ok: false,
            message: '¡ Error al actualizar la credencial, revise los logs del servidor !',
            credential: null,
          };
        }
        return {
          ok: false,
          message: '¡ Error inesperado, revise los logs !',
          credential: null,
        };
      }
    });

    return prismaTransaction;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '¡ Error inesperado, revise los logs del servidor !',
      credential: null,
    };
  }
};
