'use server';

import prisma from '@/lib/prisma';

type FetchCredentialResponse = Promise<{
  ok: boolean;
  message: string;
  credential: {
    id: string;
    fullName: string;
    birthdate: Date;
    curp: string;
    position: string;
    jerseyNumber: number;
    tournament: {
      id: string;
      name: string;
    };
    player: {
      id: string;
      name: string;
      imagePublicID: string | null;
      team: {
        id?: string,
        name?: string,
      };
    };
  } | null;
}>;

export const fetchCredentialAction = async (
  id: string,
  userRole: string[] | null,
): FetchCredentialResponse => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos !',
      credential: null,
    };
  }

  try {
    const credential = await prisma.credential.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        birthdate: true,
        curp: true,
        position: true,
        jerseyNumber: true,
        // Relations
        tournament: {
          select: {
            id: true,
            name: true,
          },
        },
        player: {
          select: {
            id: true,
            name: true,
            imagePublicID: true,
            team: {
              select: {
                id: true,
                name: true,
              }
            },
          },
        },
      }
    });

    if (!credential) {
      return {
        ok: false,
        message: '¡ Credencial no encontrada ❌ !',
        credential: null,
      };
    }

    return {
      ok: true,
      message: '¡ Credencial obtenida correctamente 👍 !',
      credential: {
        id: credential.id, 
        fullName: credential.fullName,
        birthdate: credential.birthdate,
        curp: credential.curp,
        position: credential.position,
        jerseyNumber: credential.jerseyNumber,
        tournament: {
          id: credential.tournament.id,
          name: credential.tournament.name,
        },
        player: {
          id: credential.player.id,
          name: credential.player.name,
          imagePublicID: credential.player.imagePublicID,
          team: {
            id: credential.player.team?.id,
            name: credential.player.team?.name,
          },
        },
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener la credencial,\n¡ Revise los logs del servidor !",
        credential: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      credential: null,
    };
  }
};
