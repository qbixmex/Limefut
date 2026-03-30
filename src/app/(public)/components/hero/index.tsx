import { fetchPublicHeroBannersAction } from '@/app/(public)/(actions)/home/fetchPublicHeroBannersAction';
import { HeroCarousel } from '../carousel/hero-carousel';

export const Hero = async () => {
  const { heroBanners } = await fetchPublicHeroBannersAction();

  return (
    <HeroCarousel
      banners={heroBanners}
      options={{
        align: 'center',
        dragFree: false,
        loop: false,
        slidesToScroll: 'auto',
      }}
      time={10000}
      play={true}
    />
  );
};

export default Hero;
