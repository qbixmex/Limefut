'use server';

import type { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import type { Pagination, Credential } from "@/shared/interfaces";

type Options = Readonly<{
  page?: number;
  take?: number;
  searchTerm: string;
}>;

export type ResponseFetchAction = Promise<{
  ok: boolean;
  message: string;
  credentials: Pick<Credential, 'id' | 'fullName' | 'curp' | 'jerseyNumber'>[] | null;
  pagination: Pagination | null;
}>;

export const fetchCredentialsAction = async (options?: Options): ResponseFetchAction => {
  let { page = 1, take = 12 } = options ?? {};

  // In case is an invalid number like (lorem)
  if (isNaN(page)) page = 1;
  if (isNaN(take)) take = 12;

  const whereCondition: Prisma.CredentialWhereInput = options?.searchTerm ? {
    OR: [
      {
        fullName: {
          contains: options.searchTerm,
          mode: 'insensitive' as const,
        },
      },
      {
        curp: {
          contains: options.searchTerm,
          mode: 'insensitive' as const,
        },
      },
    ],
  } : {};

  try {
    const credentials = await prisma.credential.findMany({
      where: whereCondition,
      orderBy: { fullName: 'asc' },
      take: take,
      skip: (page - 1) * take,
      select: {
        id: true,
        fullName: true,
        curp: true,
        jerseyNumber: true,
      },
    });

    const totalCount = await prisma.credential.count({ where: whereCondition });

    return {
      ok: true,
      message: '! Las credenciales fueron obtenidos correctamente 👍',
      credentials: credentials,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener las credenciales");
      return {
        ok: false,
        message: error.message,
        credentials: null,
        pagination: null,
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener las credenciales, revise los logs del servidor",
      credentials: null,
      pagination: null,
    };
  }
};
