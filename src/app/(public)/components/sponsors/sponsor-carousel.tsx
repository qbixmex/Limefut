'use client';

import type { FC } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSponsorsCarousel } from './use-sponsors-carousel';

type Props = Readonly<{
  sponsors: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  time?: number;
}>;

export const SponsorCarousel: FC<Props> = ({ sponsors = [], time = 10 }) => {
  const { sponsor } = useSponsorsCarousel(sponsors, time);

  if (sponsors.length === 0) return null;

  return (
    <motion.figure
      key={sponsor?.id ?? 'sponsor'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="space-y-10"
      aria-label={sponsor?.name ?? 'sponsor'}
    >
      <Image
        width={0}
        height={0}
        src={sponsor?.imageUrl ?? ''}
        alt={`Patrocinador ${sponsor?.name.toLowerCase() ?? 'Sponsor Image'}`}
        className="w-full max-w-[288px] h-auto rounded"
      />
    </motion.figure>
  );
};
