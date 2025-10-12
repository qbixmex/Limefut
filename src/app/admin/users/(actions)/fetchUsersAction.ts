'use server';

import prisma from "@/lib/prisma";
import { Pagination } from "@/shared/interfaces";

type Options = Readonly<{
  page?: number;
  take?: number;
}>;

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  roles: string[];
  isActive: boolean;
  username: string | null;
  imageUrl: string | null;
};

export type ResponseFetchUsers = Promise<{
  ok: boolean;
  message: string;
  users: AdminUser[] | null;
  pagination: Pagination | null;
}>;

export const fetchUsersAction = async (options?: Options): ResponseFetchUsers => {
  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      take: take,
      skip: (page - 1) * take,
    });

    const totalCount = await prisma.user.count();

    return {
      ok: true,
      message: '! Los usuarios fueron obtenidos satisfactoriamente 👍',
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
        roles: user.roles,
        isActive: user.isActive,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los usuarios");
      return {
        ok: false,
        message: error.message,
        users: null,
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los artículos, revise los logs del servidor",
      users: null,
      pagination: null,
    };
  }
};
