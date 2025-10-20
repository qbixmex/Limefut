'use server';

import prisma from "@/lib/prisma";
import type { Tournament, Coach, Pagination } from "@/shared/interfaces";

type Options = Readonly<{
  page?: number;
  take?: number;
}>;

export type ResponseFetchTeams = Promise<{
  ok: boolean;
  message: string;
  teams: {
    id: string;
    name: string;
    permalink: string;
    imageUrl: string | null,
    division: string;
    group: string;
    active: boolean;
    tournament: Pick<Tournament, 'id' | 'name' | 'permalink'>;
    coach: Pick<Coach, 'id' | 'name'>;
  }[] | null;
  pagination: Pagination | null;
}>;

export const fetchTeamsAction = async (options?: Options): ResponseFetchTeams => {
  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  try {
    const teams = await prisma.team.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        division: true,
        group: true,
        active: true,
        tournament: {
          select: {
            id: true,
            name: true,
            permalink: true,
          }
        },
        coach: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      take: take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.team.count();

    return {
      ok: true,
      message: '! Los equipos fueron obtenidos correctamente 👍',
      teams: teams.map((team) => ({
        ...team,
        coach: {
          id: team.coach?.id ?? '',
          name: team.coach?.name ?? 'Sin entrenador',
        },
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los equipos");
      return {
        ok: false,
        message: error.message,
        teams: null,
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los equipos, revise los logs del servidor",
      teams: null,
      pagination: null,
    };
  }
};
