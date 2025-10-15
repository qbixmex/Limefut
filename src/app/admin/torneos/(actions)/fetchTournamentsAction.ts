'use server';

import prisma from "@/lib/prisma";
import { Pagination } from "@/shared/interfaces";

type Options = Readonly<{
  page?: number;
  take?: number;
}>;

export type ResponseFetchTournaments = Promise<{
  ok: boolean;
  message: string;
  tournaments: {
    id: string;
    name: string;
    permalink: string;
    season: string;
    startDate: Date;
    endDate: Date;
    active: boolean;
  }[] | null;
  pagination: Pagination | null;
}>;

export const fetchTournamentsAction = async (options?: Options): ResponseFetchTournaments => {
  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  try {
    const teams = await prisma.tournament.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        permalink: true,
        season: true,
        startDate: true,
        endDate: true,
        active: true,
      },
      take: take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.tournament.count();

    return {
      ok: true,
      message: '! Los torneos fueron obtenidos correctamente 👍',
      tournaments: teams.map((team) => ({
        id: team.id,
        name: team.name,
        permalink: team.permalink,
        season: team.season,
        startDate: team.startDate,
        endDate: team.endDate,
        active: team.active,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los torneos");
      return {
        ok: false,
        message: error.message,
        tournaments: null,
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los torneos, revise los logs del servidor",
      tournaments: null,
      pagination: null,
    };
  }
};
