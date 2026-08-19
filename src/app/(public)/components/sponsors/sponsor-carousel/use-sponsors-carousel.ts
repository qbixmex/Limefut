import { useEffect, useState } from 'react';

type SponsorType = {
  id: string;
  name: string;
  imageUrl: string;
};

export const useSponsorsCarousel = (sponsors: SponsorType[], time = 10) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (sponsors.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, time * 1000);

    return () => clearInterval(interval);
  }, [sponsors.length, time]);

  const currentSponsor = (sponsors.length > 0)
    ? sponsors[currentIndex]
    : undefined;

  return {
    sponsor: currentSponsor,
  };
};
