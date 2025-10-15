'use server';

import prisma from '@/lib/prisma';
import { Team } from "@/shared/interfaces";

type FetchTeamResponse = Promise<{
  ok: boolean;
  message: string;
  team: Team | null;
}>;

export const fetchTournamentAction = async (
  permalink: string,
  userRole: string[] | null,
): FetchTeamResponse => {
  if ((userRole !== null) && (!userRole.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para editar equipos !',
      team: null,
    };
  }

  try {
    const team = await prisma.team.findUnique({
      where: { permalink: permalink },
    });

    if (!team) {
      return {
        ok: false,
        message: '¡ Equipo no encontrado ❌ !',
        team: null,
      };
    }

    return {
      ok: true,
      message: '¡ Equipo obtenido correctamente 👍 !',
      team: {
        id: team.id,
        name: team.name,
        permalink: team.permalink,
        headquarters: team.headquarters,
        imageUrl: team.imageUrl,
        imagePublicID: null,
        division: team.division,
        group: team.group,
        tournament: team.tournament,
        country: team.country,
        city: team.city,
        state: team.state,
        coach: team.coach,
        emails: team.emails,
        address: team.address,
        active: team.active,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        ok: false,
        message: "No se pudo obtener el equipo,\n¡ Revise los logs del servidor !",
        team: null,
      };
    }
    return {
      ok: false,
      message: "Error inesperado del servidor,\n¡ Revise los logs del servidor !",
      team: null,
    };
  }
};
