'use server';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

type Options = Readonly<{
  quantity: number;
}>;

export type ResponseFetch = Promise<{
  ok: boolean;
  message: string;
  latestMessages: {
    id: string;
    message: string;
  }[];
}>;

export const fetchLatestMessagesAction = async ({ quantity }: Options): Promise<ResponseFetch> => {
  "use cache";

  cacheLife('days');
  cacheTag('dashboard-messages');

  try {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now);
    endDate.setDate(now.getDate());
    endDate.setHours(23, 59, 59, 999);

    const latestMessages = await prisma.contactMessage.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        message: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: quantity,
    });

    return {
      ok: true,
      message: '! Los mensajes fueron obtenidos correctamente 👍',
      latestMessages,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al intentar obtener los mensajes");
      return {
        ok: false,
        message: error.message,
        latestMessages: [],
      };
    }
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado al obtener los mensajes, revise los logs del servidor",
      latestMessages: [],
    };
  }
};
