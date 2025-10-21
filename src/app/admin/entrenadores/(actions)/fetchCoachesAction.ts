'use server';

import prisma from "@/lib/prisma";
import { Pagination } from "@/shared/interfaces";

type Options = Readonly<{
  page?: number;
  take?: number;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  coaches: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    imageUrl: string | null;
    active: boolean;
    teamsCount: number;
  }[] | null;
  pagination: Pagination | null;
}>;

export const fetchCoachesAction = async (options?: Options): ResponseFetchAction => {
  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  try {
    const coaches = await prisma.coach.findMany({
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
        _count: {
          select: { teams: true },
        },
      }
    });

    const totalCount = await prisma.team.count();

    return {
      ok: true,
      message: '! Los entrenadores fueron obtenidos correctamente 👍',
      coaches: coaches.map((coach) => ({
        ...coach,
        teamsCount: coach._count.teams,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los entrenadores");
      return {
        ok: false,
        message: error.message,
        coaches: null,
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los entrenadores, revise los logs del servidor",
      coaches: null,
      pagination: null,
    };
  }
};
