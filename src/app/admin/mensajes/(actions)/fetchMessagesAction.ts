'use server';

import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import type { ContactMessage, Pagination } from "@/shared/interfaces";
import { cacheLife, cacheTag } from "next/cache";

type Options = Readonly<{
  userRoles: string[] | null,
  searchTerm?: string;
  page?: number;
  take?: number;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  messages: ContactMessage[] | null;
  pagination: Pagination | null;
}>;

export const fetchMessagesAction = async (options?: Options): ResponseFetchAction => {
  "use cache";

  cacheLife("weeks");
  cacheTag("admin-messages");

  if ((options?.userRoles !== null) && (!options?.userRoles.includes('admin'))) {
    return {
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
      messages: null,
      pagination: null,
    };
  }

  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.ContactMessageWhereInput = {};

  if (options?.searchTerm) {
    const searchTerm = options.searchTerm;

    whereCondition.OR = [
      { // Search by name
        name: {
          contains: searchTerm, mode: 'insensitive',
        },
      },
      { // Search by email
        email: {
          contains: searchTerm, mode: 'insensitive',
        },
      },
    ];
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      take: take,
      skip: (page - 1) * take,
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        read: true,
        createdAt: true,
      },
    });

    const totalCount = await prisma.contactMessage.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Los mensajes fueron obtenidos correctamente 👍',
      messages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los mensajes");
      return {
        ok: false,
        message: error.message,
        messages: null,
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los encuentros, revise los logs del servidor",
      messages: null,
      pagination: null,
    };
  }
};

