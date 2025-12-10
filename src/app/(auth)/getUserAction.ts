'use server';

import prisma from "../../lib/prisma";

export const getUserAction = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email as string },
  });

  return (!user) ? null : user;
};
