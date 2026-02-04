import { fetchPublicHeroBannersAction } from "../../(actions)/home/fetchPublicHeroBannersAction";
import { HeroCarousel } from "../carousel/hero-carousel";

export const Hero = async () => {
  const { heroBanners } = await fetchPublicHeroBannersAction();

  return (
    <HeroCarousel
      banners={heroBanners}
      options={{
        align: 'center',
        dragFree: true,
        loop: false,
        slidesToScroll: 'auto',
      }}
      time={8000}
      play={true}
    />
  );
};

export default Hero;