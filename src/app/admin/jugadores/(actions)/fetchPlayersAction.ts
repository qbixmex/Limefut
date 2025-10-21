'use server';

import prisma from "@/lib/prisma";
import { Pagination, Team } from "@/shared/interfaces";

type Options = Readonly<{
  page?: number;
  take?: number;
}>;

type TeamType = Pick<Team, 'name' | 'permalink'>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  players: {
    id: string;
    name: string;
    email: string;
    imageUrl: string | null;
    active: boolean;
    team: TeamType | null;
  }[] | null;
  pagination: Pagination | null;
}>;

export const fetchPlayersAction = async (options?: Options): ResponseFetchAction => {
  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  try {
    const players = await prisma.player.findMany({
      orderBy: { name: 'asc' },
      take: take,
      skip: (page - 1) * take,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        imageUrl: true,
        active: true,
        team: {
          select: {
            name: true,
            permalink: true,
          },
        },
      },
    });

    const totalCount = await prisma.team.count();

    return {
      ok: true,
      message: '! Los jugadores fueron obtenidos correctamente 👍',
      players,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los jugadores");
      return {
        ok: false,
        message: error.message,
        players: null,
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los jugadores, revise los logs del servidor",
      players: null,
      pagination: null,
    };
  }
};
