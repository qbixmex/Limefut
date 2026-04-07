'use server';

import prisma from '@/lib/prisma';
import { updateTag } from 'next/cache';

export const incrementClickAction = async (id: string): Promise<{ ok: boolean; }> => {
  const sponsorExists = await prisma.sponsor.count({
    where: { id },
  });

  if (sponsorExists === 0) {
    return { ok: false };
  }

  await prisma.sponsor.update({
    where: { id },
    data: { clicks: { increment: 1 } },
  });

  // Update Cache
  updateTag('admin-sponsors');
  updateTag('admin-sponsor');

  return { ok: true };
};
