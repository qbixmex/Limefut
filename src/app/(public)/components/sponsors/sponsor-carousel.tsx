'use client';

import type { FC } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type Props = Readonly<{
  sponsors: Array<{
    id: string;
    name: string;
    imageUrl: string;
  }>;
  time?: number;
}>;

export const SponsorCarousel: FC<Props> = ({ sponsors, time = 10 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, time * 1000);

    return () => clearInterval(interval);
  }, [sponsors.length, time]);

  const currentSponsor = sponsors[currentIndex];

  return (
    <motion.figure
      key={currentIndex}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="space-y-10"
    >
      <Image
        width={0}
        height={0}
        src={currentSponsor.imageUrl}
        alt={`${currentSponsor.name} patrocinador`}
        className="w-full max-w-[288px] h-auto rounded"
      />
      <figcaption className="visually-hidden">{currentSponsor.name}</figcaption>
    </motion.figure>
  );
};
