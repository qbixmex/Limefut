import { fetchPublicHeroBannersAction } from "../../(actions)/home/fetchPublicHeroBannersAction";
import { HeroCarousel } from "../carousel/hero-carousel";

export const Hero = async () => {
  const { heroBanners } = await fetchPublicHeroBannersAction();

  if (heroBanners.length === 0) return null;

  return (
    <HeroCarousel
      banners={heroBanners}
      options={{
        align: 'center',
        dragFree: false,
        loop: false,
        slidesToScroll: 'auto',
      }}
      time={10_000}
      play={true}
    />
  );
};

export default Hero;