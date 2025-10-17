'use server';

import prisma from "@/lib/prisma";
import { Coach } from "@/shared/interfaces/Coach";
import { Pagination } from "@/shared/interfaces";

type Options = Readonly<{
  page?: number;
  take?: number;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  coaches: Coach[] | null;
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
    });

    const totalCount = await prisma.team.count();

    return {
      ok: true,
      message: '! Los equipos fueron obtenidos correctamente 👍',
      coaches,
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
